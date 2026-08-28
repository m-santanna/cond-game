import { EffectKey } from './enums/effect-key.enum';
import { DamageEffect } from './effects/DamageEffect';
import { HealingEffect } from './effects/HealingEffect';
import { Effect } from './types/effect.types';

type EffectConstructor = new (
  value: number,
  sourceId: string,
  targetId: string,
) => Effect;

export const EFFECT_REGISTRY: Record<EffectKey, EffectConstructor> = {
  [EffectKey.DAMAGE]: DamageEffect,
  [EffectKey.HEALING]: HealingEffect,
};

export function createEffect(
  key: EffectKey,
  value: number,
  sourceId: string,
  targetId: string,
): Effect {
  const EffectClass = EFFECT_REGISTRY[key];
  if (!EffectClass) {
    throw new Error(`Unknown effect key: ${key}`);
  }
  return new EffectClass(value, sourceId, targetId);
}
