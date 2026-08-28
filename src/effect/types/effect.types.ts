import { Battle } from 'src/battle/types/battle.types';
import { EffectType } from '../enums/effect-types.enum';
import { EffectKey } from '../enums/effect-key.enum';

export interface Effect {
  key: EffectKey;
  name: string;
  type: EffectType;
  value: number;
  sourceId: string;
  targetId: string;
  onCast: (battle: Battle) => Battle;
}
