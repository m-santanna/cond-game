import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { ChestLoot } from './entities/chest-loot.entity';
import { ChestService } from './chest.service';
import { ChestController } from './chest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChestDefinition, ChestLoot])],
  providers: [ChestService],
  controllers: [ChestController],
  exports: [ChestService],
})
export class ChestModule {}
