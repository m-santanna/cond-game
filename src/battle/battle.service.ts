import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT } from '../database/redis.module';
import { Battle, BattleEntity, Team } from './types/battle.types';
import { BattleState } from './enums/battle-state.enum';
import { EntityType } from './enums/entity-type.enum';
import { TeamSide } from './enums/team-side.enum';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UserService } from '../user/user.service';
import { BuildService } from '../build/build.service';

@Injectable()
export class BattleService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly buildService: BuildService,
  ) {}

  private getBattleKey(battleId: string): string {
    return `battle:${battleId}`;
  }

  async createBattle(dto: CreateBattleDto): Promise<Battle> {
    const attackerTeam: Team = {
      side: TeamSide.ATTACKER,
      entities: [],
    };

    const defenderTeam: Team = {
      side: TeamSide.DEFENDER,
      entities: [],
    };

    const now = new Date().toISOString();
    const battle: Battle = {
      id: uuidv4(),
      round: 1,
      state: BattleState.IN_PROGRESS,
      teams: [attackerTeam, defenderTeam],
      createdAt: now,
      updatedAt: now,
      locationId: dto.locationId,
    };

    await this.saveBattle(battle);
    return battle;
  }

  async getBattleById(battleId: string): Promise<Battle> {
    const rawBattle = await this.redis.get(`battle:${battleId}`);

    if (!rawBattle) {
      throw new NotFoundException(`Battle ${battleId} not found`);
    }

    return JSON.parse(rawBattle) as Battle;
  }

  async saveBattle(battle: Battle): Promise<void> {
    const key = this.getBattleKey(battle.id);
    battle.updatedAt = new Date().toISOString();
    await this.redis.set(key, JSON.stringify(battle));
  }

  async deleteBattle(battleId: string): Promise<void> {
    const key = this.getBattleKey(battleId);
    await this.redis.del(key);
  }

  private async createUserEntity(userId: string): Promise<BattleEntity> {
    const user = await this.userService.getUserById(userId);
    // const build = await this.buildService.getBuildByUserId(userId);

    return {
      id: uuidv4(),
      sourceId: userId,
      type: EntityType.USER,
      name: user.username,
      maxHealth: 30,
      health: 30,
      armor: 0,
      maxEnergy: 4,
      energy: 4,
    };
  }

  private createMobEntities(): BattleEntity[] {
    return [
      {
        id: uuidv4(),
        sourceId: 'mock-goblin',
        type: EntityType.MOB,
        name: 'Goblin Scout',
        maxHealth: 10,
        health: 10,
        armor: 0,
        maxEnergy: 2,
        energy: 2,
      },
    ];
  }

  getAllies(battle: Battle, entityId: string): BattleEntity[] {
    const entityTeam = this.findEntityTeam(battle, entityId);
    if (!entityTeam) return [];
    return entityTeam.entities;
  }

  getEnemies(battle: Battle, entityId: string): BattleEntity[] {
    const entityTeam = this.findEntityTeam(battle, entityId);
    if (!entityTeam) return [];

    const enemyTeam = battle.teams.find(
      (team) => team.side !== entityTeam.side,
    );
    return enemyTeam ? enemyTeam.entities : [];
  }

  private findEntityTeam(battle: Battle, entityId: string): Team | undefined {
    return battle.teams.find((team) =>
      team.entities.some((entity) => entity.id === entityId),
    );
  }
}
