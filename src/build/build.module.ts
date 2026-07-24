import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildService } from './build.service';
import { Build } from './entities/build.entity';
import { Equipment } from '../equipment/entities/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Build, Equipment])],
  providers: [BuildService],
  exports: [BuildService],
})
export class BuildModule {}
