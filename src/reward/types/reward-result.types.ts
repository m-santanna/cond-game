import { ChestLootType } from '../../chest/enums/chest-loot-type.enum';

export interface Reward {
  type: ChestLootType;
  amount: number;
  details: {
    key: string;
    tier?: number;
    condition?: string;
    equipmentId?: string;
  };
}
