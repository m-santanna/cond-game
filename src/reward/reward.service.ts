import { Injectable } from '@nestjs/common';
import { ChestService } from '../chest/chest.service';
import { LocationService } from '../location/location.service';
import { InventoryService } from '../inventory/inventory.service';
import { EquipmentService } from '../equipment/equipment.service';
import { Reward } from './types/reward-result.types';
import {
  ChestProfile,
  ChestReward,
  DirectReward,
  PoolReward,
} from '../chest/types/chest-profile.types';
import { RewardProfile } from '../location/types/reward-profile.types';
import { ChestLootType } from '../chest/enums/chest-loot-type.enum';
import { EquipmentCondition } from '../equipment/enums/equipment-condition.enum';
import { Equipment } from '../equipment/entities/equipment.entity';
import {
  selectWeightedRandom,
  randomWeightedAmount,
} from '../common/random.utils';
import { OpenChestDto } from './dto/open-chest.dto';

@Injectable()
export class RewardService {
  constructor(
    private readonly chestService: ChestService,
    private readonly locationService: LocationService,
    private readonly inventoryService: InventoryService,
    private readonly equipmentService: EquipmentService,
  ) {}

  async openChest(openChestDto: OpenChestDto): Promise<Reward[]> {
    const chestProfile = this.chestService.getChestProfile(
      openChestDto.chestKey,
    );
    const difficultyProfile = this.locationService.getDifficultyProfile(
      openChestDto.difficultyProfileKey,
    );
    const rewardProfile = this.locationService.getRewardProfile(
      difficultyProfile.rewardProfileKey,
    );

    const rewards = await this.processChestRewards(chestProfile, rewardProfile);

    // await this.addRewardsToInventory(openChestDto.userId, rewards);

    return rewards;
  }

  private async processChestRewards(
    chestProfile: ChestProfile,
    rewardProfile: RewardProfile,
  ): Promise<Reward[]> {
    const rewardPromises = chestProfile.rewards.map((reward) =>
      this.processReward(reward, rewardProfile),
    );
    const rewardArrays = await Promise.all(rewardPromises);
    return rewardArrays.flat();
  }

  private async processReward(
    reward: ChestReward,
    rewardProfile: RewardProfile,
  ): Promise<Reward[]> {
    if (reward.type === 'pool') {
      return this.rollFromPool(reward, rewardProfile);
    }
    const directReward = await this.processDirectReward(
      reward as DirectReward,
      rewardProfile,
    );
    return [directReward];
  }

  private async rollFromPool(
    poolReward: PoolReward,
    rewardProfile: RewardProfile,
  ): Promise<Reward[]> {
    const lootPool = this.chestService.getLootPool(poolReward.key);
    const rewards: Reward[] = [];

    for (let i = 0; i < poolReward.rolls; i++) {
      const selectedKey = selectWeightedRandom(lootPool.entries, 'key');
      const selectedEntry = lootPool.entries.find(
        (entry) => entry.key === selectedKey,
      );

      const reward = await this.generateRewardByType(
        selectedEntry.type,
        selectedEntry.key,
        selectedEntry.minAmount | 1,
        selectedEntry.maxAmount | 1,
        rewardProfile,
      );
      rewards.push(reward);
    }

    return rewards;
  }

  private async processDirectReward(
    reward: DirectReward,
    rewardProfile: RewardProfile,
  ): Promise<Reward> {
    return this.generateRewardByType(
      reward.type,
      reward.key,
      reward.minAmount,
      reward.maxAmount,
      rewardProfile,
    );
  }

  private async generateRewardByType(
    type: ChestLootType,
    key: string,
    minAmount: number,
    maxAmount: number,
    rewardProfile: RewardProfile,
  ): Promise<Reward> {
    const amount = randomWeightedAmount(minAmount, maxAmount);

    if (type === ChestLootType.EQUIPMENT) {
      return this.generateEquipment(key, rewardProfile);
    }

    if (type === ChestLootType.ITEM) {
      return this.generateItem(key, amount);
    }

    return this.generateResource(key, amount);
  }

  private async generateEquipment(
    equipmentKey: string,
    rewardProfile: RewardProfile,
  ): Promise<Reward> {
    await this.equipmentService.getDefinitionByKey(equipmentKey);

    const tier = this.rollTier(rewardProfile.tierDistributionKey);
    const condition = this.rollCondition(
      rewardProfile.conditionDistributionKey,
    );

    return {
      type: ChestLootType.EQUIPMENT,
      amount: 1,
      details: {
        key: equipmentKey,
        tier,
        condition,
      },
    };
  }

  private generateItem(itemKey: string, amount: number): Reward {
    return {
      type: ChestLootType.ITEM,
      amount,
      details: {
        key: itemKey,
      },
    };
  }

  private generateResource(resourceKey: string, amount: number): Reward {
    return {
      type: ChestLootType.RESOURCE,
      amount,
      details: {
        key: resourceKey,
      },
    };
  }

  private rollTier(tierDistributionKey: string): number {
    const tierDistribution =
      this.locationService.getTierDistribution(tierDistributionKey);

    const tier = selectWeightedRandom(tierDistribution.entries, 'tier');

    return tier;
  }

  private rollCondition(conditionDistributionKey: string): EquipmentCondition {
    const conditionDistribution = this.locationService.getConditionDistribution(
      conditionDistributionKey,
    );

    const condition = selectWeightedRandom(
      conditionDistribution.entries,
      'condition',
    );

    return condition;
  }

  private async addRewardsToInventory(
    userId: string,
    rewards: Reward[],
  ): Promise<Equipment[]> {
    const equipmentRewards = rewards.filter(
      (reward) => reward.type === ChestLootType.EQUIPMENT,
    );

    const equipment: Equipment[] = [];

    for (const reward of equipmentRewards) {
      const definition = await this.equipmentService.getDefinitionByKey(
        reward.details.key,
      );

      const createdEquipment = await this.inventoryService.addEquipment(
        userId,
        definition.id,
        {
          tier: reward.details.tier,
          condition: reward.details.condition as EquipmentCondition,
        },
      );

      reward.details.equipmentId = createdEquipment.id;
      equipment.push(createdEquipment);
    }

    return equipment;
  }
}
