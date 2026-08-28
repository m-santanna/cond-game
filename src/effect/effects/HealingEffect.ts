import { Battle } from 'src/battle/types/battle.types';
import { EffectType } from '../enums/effect-types.enum';
import { EffectKey } from '../enums/effect-key.enum';
import { Effect } from '../types/effect.types';
import { BadRequestException } from '@nestjs/common';

export class HealingEffect implements Effect {
  key: EffectKey.HEALING;
  name: 'Heal';
  type: EffectType.POSITIVE;

  value: number;
  sourceId: string;
  targetId: string;

  constructor(value: number, sourceId: string, targetId: string) {
    this.value = value;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }

  onCast(battle: Battle): Battle {
    const targetTeam = battle.teams.find((team) =>
      team.entities.some((entity) => entity.id === this.targetId),
    );

    if (targetTeam === undefined) {
      throw new BadRequestException(
        `Target entity with id ${this.targetId} not found in battle`,
      );
    }

    const targetSide = targetTeam.side;
    const targetPos = battle.teams[targetSide].entities.findIndex(
      (entity) => entity.id === this.targetId,
    );

    // TODO: trigger target's onDamage stats

    battle.teams[targetSide].entities[targetPos].health += this.value;
    return battle;
  }
}
