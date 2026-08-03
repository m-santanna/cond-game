import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import lootPoolsJson from './configs/loot-pools.json';
import chestDefinitionsJson from './configs/chest-definitions.json';
import { LootPools } from './types/loot-pool.types';
import { ChestConfigs } from './types/chest-config.types';

@Injectable()
export class ChestService {
  private readonly lootPools: LootPools = lootPoolsJson as LootPools;
  private readonly chestConfigs: ChestConfigs =
    chestDefinitionsJson as ChestConfigs;

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

  getChestConfig(chestKey: string) {
    const config = this.chestConfigs[chestKey];
    if (!config) {
      throw new NotFoundException(`Chest config "${chestKey}" not found`);
    }
    return config;
  }

  getAllChestConfigs(): ChestConfigs {
    return this.chestConfigs;
  }
}
