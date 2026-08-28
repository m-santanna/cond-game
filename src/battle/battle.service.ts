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
import { MobService } from '../mob/mob.service';

@Injectable()
export class BattleService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly buildService: BuildService,
    private readonly mobService: MobService,
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

  async addEntityToBattle(
    battleId: string,
    sourceId: string,
    entityType: EntityType,
    side: TeamSide,
  ): Promise<Battle> {
    const battle = await this.getBattleById(battleId);

    const entity =
      entityType === EntityType.USER
        ? await this.createUserEntity(sourceId)
        : await this.createMobEntity(sourceId);

    const team = this.getTeamBySide(battle, side);
    team.entities.push(entity);

    await this.saveBattle(battle);
    return battle;
  }

  private async createUserEntity(userId: string): Promise<BattleEntity> {
    const user = await this.userService.getUserById(userId);

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

  private async createMobEntity(
    mobDefinitionId: string,
  ): Promise<BattleEntity> {
    const mobDefinition =
      await this.mobService.getDefinitionById(mobDefinitionId);

    return {
      id: uuidv4(),
      sourceId: mobDefinitionId,
      type: EntityType.MOB,
      name: mobDefinition.name,
      maxHealth: mobDefinition.health,
      health: mobDefinition.health,
      armor: 0,
      maxEnergy: 2,
      energy: 2,
    };
  }

  private getTeamBySide(battle: Battle, side: TeamSide): Team {
    const team = battle.teams.find((t) => t.side === side);
    if (!team) {
      throw new Error(`Team with side ${side} not found in battle`);
    }
    return team;
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
