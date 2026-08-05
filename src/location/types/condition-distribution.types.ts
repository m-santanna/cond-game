import { EquipmentCondition } from '../../equipment/enums/equipment-condition.enum';

export interface ConditionEntry {
  condition: EquipmentCondition;
  probability: number;
}

export interface ConditionDistribution {
  entries: ConditionEntry[];
}

export interface ConditionDistributions {
  [key: string]: ConditionDistribution;
}
