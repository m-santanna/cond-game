import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostgresModule } from './database/postgres.module';
import { RedisModule } from './database/redis.module';
import { EquipmentModule } from './equipment/equipment.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { BuildModule } from './build/build.module';
import { ChestModule } from './chest/chest.module';
import { LocationModule } from './location/location.module';
import { RewardModule } from './reward/reward.module';
import { BattleModule } from './battle/battle.module';
import { MobModule } from './mob/mob.module';
import { EffectModule } from './effect/effect.module';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    UserModule,
    EquipmentModule,
    InventoryModule,
    AuthModule,
    BuildModule,
    ChestModule,
    LocationModule,
    RewardModule,
    BattleModule,
    MobModule,
    EffectModule,
  ],
})
export class AppModule {}
