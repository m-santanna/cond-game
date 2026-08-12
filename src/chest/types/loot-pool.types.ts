import { ChestLootType } from '../enums/chest-loot-type.enum';

export interface LootPoolEntry {
  type: ChestLootType;
  key: string;
  probability: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface LootPool {
  entries: LootPoolEntry[];
}

export interface LootPools {
  [poolName: string]: LootPool;
}
