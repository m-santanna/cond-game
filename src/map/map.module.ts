import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { ChestModule } from '../chest/chest.module';

@Module({
  imports: [TypeOrmModule.forFeature([Map, LocationDefinition]), ChestModule],
  providers: [MapService],
  controllers: [MapController],
  exports: [MapService],
})
export class MapModule {}
