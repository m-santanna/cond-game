import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMap } from './entities/game-map.entity';
import { Location } from './entities/location.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { LocationMob } from './entities/location-mob.entity';
import { LocationVisit } from './entities/location-visit.entity';
import { MobDefinition } from './entities/mob-definition.entity';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { MapAdminController } from './map-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameMap,
      Location,
      LocationDefinition,
      LocationMob,
      LocationVisit,
      MobDefinition,
    ]),
  ],
  providers: [MapService],
  controllers: [MapController, MapAdminController],
  exports: [MapService],
})
export class MapModule {}
