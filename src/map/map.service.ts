import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { DataSource, In, Repository } from 'typeorm';
import { GameMap } from './entities/game-map.entity';
import { Location } from './entities/location.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { LocationMob } from './entities/location-mob.entity';
import { LocationVisit } from './entities/location-visit.entity';
import { MobDefinition } from './entities/mob-definition.entity';
import { LootType } from './enums/loot-type.enum';
import { generatePlacements, shuffle } from './map-generation';
import {
  DIFFICULTY_TIERS,
  MAP_REGEN_CRON,
  MIN_LOCATIONS_PER_LOOT_TYPE,
  MIN_MOB_DEFINITIONS_PER_TIER,
  MOBS_PER_LOCATION,
} from '../lib/constants';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(GameMap)
    private mapRepo: Repository<GameMap>,
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    @InjectRepository(LocationDefinition)
    private definitionRepo: Repository<LocationDefinition>,
    @InjectRepository(MobDefinition)
    private mobDefinitionRepo: Repository<MobDefinition>,
    @InjectRepository(LocationVisit)
    private visitRepo: Repository<LocationVisit>,
    private dataSource: DataSource,
  ) {}

  // ---- Player-facing ----

  async getMaps(): Promise<GameMap[]> {
    return this.mapRepo.find({ order: { id: 'ASC' } });
  }

  async getMap(mapId: number): Promise<Location[]> {
    const map = await this.mapRepo.findOne({ where: { id: mapId } });
    if (!map) {
      throw new NotFoundException(`Map ${mapId} not found`);
    }

    return this.locationRepo.find({
      where: { mapId },
      relations: { mobs: true },
    });
  }

  async visitLocation(
    userId: string,
    locationId: string,
  ): Promise<LocationVisit> {
    const location = await this.locationRepo.findOne({
      where: { id: locationId },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Atomic upsert so concurrent visits don't lose increments
    await this.visitRepo.query(
      `INSERT INTO location_visits (user_id, location_id, count)
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, location_id)
       DO UPDATE SET count = location_visits.count + 1`,
      [userId, locationId],
    );

    return this.visitRepo.findOneOrFail({ where: { userId, locationId } });
  }

  async getVisits(userId: string): Promise<LocationVisit[]> {
    return this.visitRepo.find({ where: { userId } });
  }

  // ---- Generation ----

  async regenerateMap(mapId: number): Promise<Location[]> {
    const map = await this.mapRepo.findOne({ where: { id: mapId } });
    if (!map) {
      throw new NotFoundException(`Map ${mapId} not found`);
    }

    await this.validateCatalog();

    const definitions = await this.definitionRepo.find();
    const mobDefinitions = await this.mobDefinitionRepo.find();
    const mobsByTier = new Map<number, MobDefinition[]>(
      DIFFICULTY_TIERS.map((tier) => [
        tier,
        mobDefinitions.filter((m) => m.difficulty === tier),
      ]),
    );

    const placements = generatePlacements(definitions);

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(Location, { mapId });

      for (const placement of placements) {
        const location = await manager.save(
          manager.create(Location, { mapId, ...placement }),
        );

        const candidates = mobsByTier.get(placement.difficulty) ?? [];
        const mobCount = Math.min(
          candidates.length,
          MOBS_PER_LOCATION.min +
            Math.floor(
              Math.random() *
                (MOBS_PER_LOCATION.max - MOBS_PER_LOCATION.min + 1),
            ),
        );

        const mobs = shuffle(candidates)
          .slice(0, mobCount)
          .map((mob) =>
            manager.create(LocationMob, {
              locationId: location.id,
              mobDefinitionId: mob.id,
              quantity: 1,
            }),
          );
        await manager.save(mobs);
      }
    });

    return this.getMap(mapId);
  }

  @Cron(MAP_REGEN_CRON)
  async regenerateAllMaps(): Promise<void> {
    const maps = await this.getMaps();
    for (const map of maps) {
      await this.regenerateMap(map.id);
    }
  }

  // Protects generation (and the weekly cron) from a half-seeded database
  private async validateCatalog(): Promise<void> {
    const definitions = await this.definitionRepo.find();
    const missingLoot = Object.values(LootType).filter(
      (lootType) =>
        definitions.filter((d) => d.lootType === lootType).length <
        MIN_LOCATIONS_PER_LOOT_TYPE,
    );
    if (missingLoot.length > 0) {
      throw new UnprocessableEntityException(
        `Not enough location definitions (need ${MIN_LOCATIONS_PER_LOOT_TYPE} per loot type) for: ${missingLoot.join(', ')}`,
      );
    }

    const mobDefinitions = await this.mobDefinitionRepo.find();
    const missingTiers = DIFFICULTY_TIERS.filter(
      (tier) =>
        mobDefinitions.filter((m) => m.difficulty === tier).length <
        MIN_MOB_DEFINITIONS_PER_TIER,
    );
    if (missingTiers.length > 0) {
      throw new UnprocessableEntityException(
        `Not enough mob definitions (need ${MIN_MOB_DEFINITIONS_PER_TIER} per difficulty tier) for tiers: ${missingTiers.join(', ')}`,
      );
    }
  }

  // ---- Admin ----

  async createMap(name: string): Promise<Location[]> {
    await this.validateCatalog();
    const map = await this.mapRepo.save(this.mapRepo.create({ name }));
    return this.regenerateMap(map.id);
  }

  async createLocationDefinitions(
    definitions: Partial<LocationDefinition>[],
  ): Promise<LocationDefinition[]> {
    await this.rejectDuplicateNames(
      this.definitionRepo,
      definitions.map((d) => d.name!),
    );
    return this.definitionRepo.save(this.definitionRepo.create(definitions));
  }

  async getLocationDefinitions(): Promise<LocationDefinition[]> {
    return this.definitionRepo.find();
  }

  async createMobDefinitions(
    definitions: Partial<MobDefinition>[],
  ): Promise<MobDefinition[]> {
    await this.rejectDuplicateNames(
      this.mobDefinitionRepo,
      definitions.map((d) => d.name!),
    );
    return this.mobDefinitionRepo.save(
      this.mobDefinitionRepo.create(definitions),
    );
  }

  async getMobDefinitions(): Promise<MobDefinition[]> {
    return this.mobDefinitionRepo.find();
  }

  private async rejectDuplicateNames(
    repo: Repository<{ name: string }>,
    names: string[],
  ): Promise<void> {
    const duplicatesInBody = names.filter(
      (name, i) => names.indexOf(name) !== i,
    );
    const existing = await repo.find({ where: { name: In(names) } });
    const duplicates = [
      ...new Set([...duplicatesInBody, ...existing.map((e) => e.name)]),
    ];
    if (duplicates.length > 0) {
      throw new ConflictException(
        `Names already taken or repeated: ${duplicates.join(', ')}`,
      );
    }
  }
}
