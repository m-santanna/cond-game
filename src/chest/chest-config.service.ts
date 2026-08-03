import { Injectable, NotFoundException } from '@nestjs/common';
import * as lootPools from './configs/loot-pools.json';
import * as chestDefinitions from './configs/chest-definitions.json';
import { LootPools } from './types/loot-pool.types';
import { ChestConfigs } from './types/chest-config.types';

@Injectable()
export class ChestConfigService {
  private readonly lootPools: LootPools = lootPools;
  private readonly chestConfigs: ChestConfigs = chestDefinitions;

  getLootPool(poolName: string) {
    const pool = this.lootPools[poolName];
    if (!pool) {
      throw new NotFoundException(`Loot pool "${poolName}" not found`);
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
