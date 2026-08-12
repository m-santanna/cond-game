import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { ChestModule } from '../chest/chest.module';
import { LocationModule } from '../location/location.module';
import { InventoryModule } from '../inventory/inventory.module';
import { EquipmentModule } from '../equipment/equipment.module';

@Module({
  imports: [ChestModule, LocationModule, InventoryModule, EquipmentModule],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
