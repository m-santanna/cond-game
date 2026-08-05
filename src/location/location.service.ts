import { Injectable, NotFoundException } from '@nestjs/common';
import difficultyProfileJson from './configs/difficulty-profile.json';
import rewardProfileJson from './configs/reward-profile.json';
import tierDistributionJson from './configs/tier-distribution.json';
import conditionDistributionJson from './configs/condition-distribution.json';
import { DifficultyProfiles } from './types/difficulty-profile.types';
import { RewardProfiles } from './types/reward-profile.types';
import { TierDistributions } from './types/tier-distribution.types';
import { ConditionDistributions } from './types/condition-distribution.types';

@Injectable()
export class LocationService {
  private readonly difficultyProfiles: DifficultyProfiles =
    difficultyProfileJson as DifficultyProfiles;
  private readonly rewardProfiles: RewardProfiles =
    rewardProfileJson as RewardProfiles;
  private readonly tierDistributions: TierDistributions =
    tierDistributionJson as TierDistributions;
  private readonly conditionDistributions: ConditionDistributions =
    conditionDistributionJson as ConditionDistributions;

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
}
