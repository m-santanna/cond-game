import { ChestLootType } from '../enums/chest-loot-type.enum';

export interface PoolReward {
  type: 'pool';
  poolKey: string;
  rolls: number;
}

export interface DirectReward {
  type: ChestLootType;
  key: string;
  minAmount: number;
  maxAmount: number;
}

export type ChestReward = PoolReward | DirectReward;

export interface ChestConfig {
  rewards: ChestReward[];
}

export interface ChestConfigs {
  [chestKey: string]: ChestConfig;
}
