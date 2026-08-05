import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import lootPoolsJson from './configs/loot-pools.json';
import chestProfileJson from './configs/chest-profile.json';
import { LootPools } from './types/loot-pool.types';
import { ChestProfiles } from './types/chest-profile.types';

@Injectable()
export class ChestService {
  private readonly lootPools: LootPools = lootPoolsJson as LootPools;
  private readonly chestProfiles: ChestProfiles =
    chestProfileJson as ChestProfiles;

  constructor(
    @InjectRepository(ChestDefinition)
    private definitionRepo: Repository<ChestDefinition>,
  ) {}

  async getDefinitionById(id: string): Promise<ChestDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
    });

    if (!definition) {
      throw new NotFoundException(`Chest definition ${id} not found`);
    }

    return definition;
  }

  async getDefinitionByKey(key: string): Promise<ChestDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { key },
    });

    if (!definition) {
      throw new NotFoundException(
        `Chest definition with key "${key}" not found`,
      );
    }

    return definition;
  }

  async getAllDefinitions(): Promise<ChestDefinition[]> {
    return this.definitionRepo.find();
  }

  async createDefinition(
    dto: CreateChestDefinitionDto,
  ): Promise<ChestDefinition> {
    const newDefinition = this.definitionRepo.create(dto);
    return this.definitionRepo.save(newDefinition);
  }

  getLootPool(poolKey: string) {
    const pool = this.lootPools[poolKey];
    if (!pool) {
      throw new NotFoundException(`Loot pool "${poolKey}" not found`);
    }
    return pool;
  }

  getAllLootPools(): LootPools {
    return this.lootPools;
  }

  getChestProfile(chestKey: string) {
    const profile = this.chestProfiles[chestKey];
    if (!profile) {
      throw new NotFoundException(`Chest profile "${chestKey}" not found`);
    }
    return profile;
  }

  getAllChestProfiles(): ChestProfiles {
    return this.chestProfiles;
  }
}
