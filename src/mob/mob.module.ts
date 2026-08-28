import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobService } from './mob.service';
import { MobController } from './mob.controller';
import { MobDefinition } from './entities/mob-definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MobDefinition])],
  controllers: [MobController],
  providers: [MobService],
  exports: [MobService],
})
export class MobModule {}
