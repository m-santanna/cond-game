import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT } from '../database/redis.module';
import { LocationDefinition } from './entities/location-definition.entity';
import { CreateLocationDefinitionDto } from './dto/create-location-definition.dto';
import difficultyProfileJson from './configs/difficulty-profile.json';
import rewardProfileJson from './configs/reward-profile.json';
import tierDistributionJson from './configs/tier-distribution.json';
import conditionDistributionJson from './configs/condition-distribution.json';
import { DifficultyProfiles } from './types/difficulty-profile.types';
import { RewardProfiles } from './types/reward-profile.types';
import { TierDistributions } from './types/tier-distribution.types';
import { ConditionDistributions } from './types/condition-distribution.types';
import { LocationStatus } from './enums/location-status.enum';
import { LocationsMap, Location } from './types/map-data.types';
import { selectWeightedRandom, shuffle } from '../common/random.utils';
import { Time, TimeInSeconds } from '../common/time.constants';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationDefinition)
    private definitionRepo: Repository<LocationDefinition>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}
  private readonly difficultyProfiles: DifficultyProfiles =
    difficultyProfileJson as DifficultyProfiles;
  private readonly rewardProfiles: RewardProfiles =
    rewardProfileJson as RewardProfiles;
  private readonly tierDistributions: TierDistributions =
    tierDistributionJson as TierDistributions;
  private readonly conditionDistributions: ConditionDistributions =
    conditionDistributionJson as ConditionDistributions;

  private readonly difficultyWeights = [
    { difficulty: 'easy', probability: 0.3 },
    { difficulty: 'medium', probability: 0.3 },
    { difficulty: 'hard', probability: 0.3 },
    { difficulty: 'very-hard', probability: 0.1 },
  ];

  async getDefinitionById(id: string): Promise<LocationDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
    });

    if (!definition) {
      throw new NotFoundException(`Location definition ${id} not found`);
    }

    return definition;
  }

  async getAllDefinitions(): Promise<LocationDefinition[]> {
    return this.definitionRepo.find();
  }

  async createDefinition(
    dto: CreateLocationDefinitionDto,
  ): Promise<LocationDefinition> {
    const newDefinition = this.definitionRepo.create(dto);
    return this.definitionRepo.save(newDefinition);
  }

  getDifficultyProfile(key: string) {
    const profile = this.difficultyProfiles[key];
    if (!profile) {
      throw new NotFoundException(`Difficulty profile "${key}" not found`);
    }
    return profile;
  }

  getAllDifficultyProfiles(): DifficultyProfiles {
    return this.difficultyProfiles;
  }

  getRewardProfile(key: string) {
    const profile = this.rewardProfiles[key];
    if (!profile) {
      throw new NotFoundException(`Reward profile "${key}" not found`);
    }
    return profile;
  }

  getAllRewardProfiles(): RewardProfiles {
    return this.rewardProfiles;
  }

  getTierDistribution(key: string) {
    const distribution = this.tierDistributions[key];
    if (!distribution) {
      throw new NotFoundException(`Tier distribution "${key}" not found`);
    }
    return distribution;
  }

  getAllTierDistributions(): TierDistributions {
    return this.tierDistributions;
  }

  getConditionDistribution(key: string) {
    const distribution = this.conditionDistributions[key];
    if (!distribution) {
      throw new NotFoundException(`Condition distribution "${key}" not found`);
    }
    return distribution;
  }

  getAllConditionDistributions(): ConditionDistributions {
    return this.conditionDistributions;
  }

  async generateMap(userId: string): Promise<LocationsMap> {
    const definitions = await this.getAllDefinitions();

    const distributedDefinitionIds =
      this.distributeLocationDefinitions(definitions);

    const locations: Location[] = distributedDefinitionIds.map(
      (locationDefinitionId) => ({
        id: uuidv4(),
        locationDefinitionId,
        difficultyProfile: selectWeightedRandom(
          this.difficultyWeights,
          'difficulty',
        ),
        status: LocationStatus.UNEXPLORED,
      }),
    );

    const now = new Date();
    const expiresAt = new Date(now.getTime() + Time.HOUR);

    const map: LocationsMap = {
      userId: userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      locations,
    };

    const redisKey = `map:${userId}`;
    await this.redis.setex(redisKey, TimeInSeconds.HOUR, JSON.stringify(map));

    return map;
  }

  private distributeLocationDefinitions(
    definitions: LocationDefinition[],
  ): string[] {
    const definitionIds = definitions.flatMap((def) => [def.id, def.id]);
    return shuffle(definitionIds);
  }
}
