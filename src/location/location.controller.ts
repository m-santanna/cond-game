import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  DifficultyProfile,
  DifficultyProfiles,
} from './types/difficulty-profile.types';
import { RewardProfile, RewardProfiles } from './types/reward-profile.types';
import {
  TierDistribution,
  TierDistributions,
} from './types/tier-distribution.types';
import {
  ConditionDistribution,
  ConditionDistributions,
} from './types/condition-distribution.types';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('difficulty-profile/all')
  async getAllDifficultyProfiles(): Promise<DifficultyProfiles> {
    return this.locationService.getAllDifficultyProfiles();
  }

  @Get('difficulty-profile/:key')
  async getDifficultyProfile(
    @Param('key') key: string,
  ): Promise<DifficultyProfile> {
    return this.locationService.getDifficultyProfile(key);
  }

  @Get('reward-profile/all')
  async getAllRewardProfiles(): Promise<RewardProfiles> {
    return this.locationService.getAllRewardProfiles();
  }

  @Get('reward-profile/:key')
  async getRewardProfile(@Param('key') key: string): Promise<RewardProfile> {
    return this.locationService.getRewardProfile(key);
  }

  @Get('tier-distribution/all')
  async getAllTierDistributions(): Promise<TierDistributions> {
    return this.locationService.getAllTierDistributions();
  }

  @Get('tier-distribution/:key')
  async getTierDistribution(
    @Param('key') key: string,
  ): Promise<TierDistribution> {
    return this.locationService.getTierDistribution(key);
  }

  @Get('condition-distribution/all')
  async getAllConditionDistributions(): Promise<ConditionDistributions> {
    return this.locationService.getAllConditionDistributions();
  }

  @Get('condition-distribution/:key')
  async getConditionDistribution(
    @Param('key') key: string,
  ): Promise<ConditionDistribution> {
    return this.locationService.getConditionDistribution(key);
  }
}
