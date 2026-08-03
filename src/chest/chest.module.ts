import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { ChestService } from './chest.service';
import { ChestConfigService } from './chest-config.service';
import { ChestController } from './chest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChestDefinition])],
  providers: [ChestService, ChestConfigService],
  controllers: [ChestController],
  exports: [ChestService, ChestConfigService],
})
export class ChestModule {}
