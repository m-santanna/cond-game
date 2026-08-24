import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { UserModule } from '../user/user.module';
import { InventoryModule } from '../inventory/inventory.module';
import { BuildModule } from '../build/build.module';

@Module({
  imports: [UserModule, InventoryModule, BuildModule],
  controllers: [BattleController],
  providers: [BattleService],
  exports: [BattleService],
})
export class BattleModule {}
