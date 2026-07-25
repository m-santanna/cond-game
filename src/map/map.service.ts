import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../database/redis.module';
import { ChestService } from '../chest/chest.service';
import { Map } from './entities/map.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { Location, LocationSlot } from './entities/location.entity';
import { CreateMapDto } from './dto/create-map.dto';
import { CreateLocationDefinitionDto } from './dto/create-location-definition.dto';

@Injectable()
export class MapService {
  private readonly logger = new Logger(MapService.name);

  constructor(
    @InjectRepository(Map)
    private mapRepo: Repository<Map>,
    @InjectRepository(LocationDefinition)
    private definitionRepo: Repository<LocationDefinition>,
    @Inject(REDIS_CLIENT)
    private redis: Redis,
    private readonly chestService: ChestService,
  ) {}

  async getDefinitionById(id: string): Promise<LocationDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
      relations: { chestDefinition: true },
    });

    if (!definition) {
      throw new NotFoundException(`Location definition "${id}" not found`);
    }

    return definition;
  }

  async getAllDefinitions(): Promise<LocationDefinition[]> {
    return this.definitionRepo.find({ relations: { chestDefinition: true } });
  }

  async createDefinition(
    dto: CreateLocationDefinitionDto,
  ): Promise<LocationDefinition> {
    // Throws NotFoundException when the chest definition does not exist
    await this.chestService.getDefinitionById(dto.chestDefinitionId);

    const newDefinition = this.definitionRepo.create(dto);
    return this.definitionRepo.save(newDefinition);
  }

  async getMapById(id: string): Promise<Map> {
    const map = await this.mapRepo.findOne({ where: { id } });

    if (!map) {
      throw new NotFoundException(`Map "${id}" not found`);
    }

    return map;
  }

  async getAllMaps(): Promise<Map[]> {
    return this.mapRepo.find();
  }

  async createMap(dto: CreateMapDto): Promise<Map> {
    const totalDefinitions = await this.definitionRepo.count();

    // Locations within a map must be distinct, so a map can never be larger
    // than the pool. Enforcing it here is enough: definitions are never
    // deleted, so the pool only grows and generation needs no guard.
    if (dto.size > totalDefinitions) {
      throw new BadRequestException(
        `Map size ${dto.size} exceeds the ${totalDefinitions} existing location definitions`,
      );
    }

    const map = await this.mapRepo.save(this.mapRepo.create(dto));

    await this.redis
      .pipeline()
      .set(this.key(map.id, 'current'), await this.generateJson(map))
      .set(this.key(map.id, 'next'), await this.generateJson(map))
      .exec();

    return map;
  }

  async getLocations(mapId: string, slot: LocationSlot): Promise<Location[]> {
    const stored = await this.redis.get(this.key(mapId, slot));

    if (!stored) {
      throw new NotFoundException(
        `No "${slot}" locations stored for map "${mapId}"`,
      );
    }

    return JSON.parse(stored) as Location[];
  }

  /**
   * Promotes next week's locations to current and generates a fresh next week,
   * so admins can always inspect the upcoming map before it goes live.
   */
  async rotate(mapId: string): Promise<Location[]> {
    const map = await this.getMapById(mapId);
    const stored = await this.redis.get(this.key(mapId, 'next'));

    // Only missing on a wiped Redis, since createMap writes both slots
    const promoted: Location[] = stored
      ? (JSON.parse(stored) as Location[])
      : await this.generateLocations(map);

    await this.redis
      .pipeline()
      .set(this.key(mapId, 'current'), JSON.stringify(promoted))
      .set(this.key(mapId, 'next'), await this.generateJson(map))
      .exec();

    return promoted;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async rotateAll(): Promise<void> {
    const maps = await this.mapRepo.find();

    for (const map of maps) {
      await this.rotate(map.id);
    }

    this.logger.log(`Rotated locations for ${maps.length} map(s)`);
  }

  async generateLocations(map: Map): Promise<Location[]> {
    const definitions = await this.definitionRepo.find();

    // Partial Fisher-Yates: only the first `size` slots need shuffling
    for (let i = 0; i < map.size; i++) {
      const j = i + Math.floor(Math.random() * (definitions.length - i));
      [definitions[i], definitions[j]] = [definitions[j], definitions[i]];
    }

    return definitions.slice(0, map.size).map(
      (definition) =>
        new Location({
          id: randomUUID(),
          locationDefinitionId: definition.id,
          chestDefinitionId: definition.chestDefinitionId,
          difficulty: 1 + Math.floor(Math.random() * 5),
        }),
    );
  }

  private async generateJson(map: Map): Promise<string> {
    return JSON.stringify(await this.generateLocations(map));
  }

  private key(mapId: string, slot: LocationSlot): string {
    return `map:${mapId}:locations:${slot}`;
  }
}
