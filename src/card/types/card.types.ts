import { EffectKey } from '../../effect/enums/effect-key.enum';
import { CardKey } from '../enums/card-key.enum';

export interface CardEffect {
  key: EffectKey;
  value: number;
}

export interface Card {
  key: CardKey;
  name: string;
  description: string;
  cost: number;
  effects: CardEffect[];
}
