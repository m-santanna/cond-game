import { ChestLootType } from '../enums/chest-loot-type.enum';

export interface PoolReward {
  type: 'pool';
  key: string;
  rolls: number;
}

export interface DirectReward {
  type: ChestLootType;
  key: string;
  minAmount: number;
  maxAmount: number;
}

export type ChestReward = PoolReward | DirectReward;

export interface ChestProfile {
  rewards: ChestReward[];
}

export interface ChestProfiles {
  [chestKey: string]: ChestProfile;
}
