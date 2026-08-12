import { Controller, Post, Body } from '@nestjs/common';
import { RewardService } from './reward.service';
import { OpenChestDto } from './dto/open-chest.dto';
import { Reward } from './types/reward-result.types';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('open-chest')
  async openChest(@Body() openChestDto: OpenChestDto): Promise<Reward[]> {
    return await this.rewardService.openChest(openChestDto);
  }
}
