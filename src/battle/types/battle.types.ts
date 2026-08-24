import { BattleState } from '../enums/battle-state.enum';
import { EntityType } from '../enums/entity-type.enum';
import { TeamSide } from '../enums/team-side.enum';

export interface BattleEntity {
  id: string;
  sourceId: string;
  type: EntityType;
  name: string;
  maxHealth: number;
  health: number;
  armor: number;
  maxEnergy: number;
  energy: number;
}

export interface Team {
  side: TeamSide;
  entities: BattleEntity[];
}

export interface Battle {
  id: string;
  round: number;
  state: BattleState;
  teams: [Team, Team];
  createdAt: string;
  updatedAt: string;
  locationId?: number;
}
