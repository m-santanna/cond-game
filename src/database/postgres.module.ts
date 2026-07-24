import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentDefinition } from '../equipment/entities/equipment-definition.entity';
import { Build } from 'src/build/entities/build.entity';
import { GameMap } from 'src/map/entities/game-map.entity';
import { Location } from 'src/map/entities/location.entity';
import { LocationDefinition } from 'src/map/entities/location-definition.entity';
import { LocationMob } from 'src/map/entities/location-mob.entity';
import { LocationVisit } from 'src/map/entities/location-visit.entity';
import { MobDefinition } from 'src/map/entities/mob-definition.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'condgame',
      entities: [
        User,
        Inventory,
        Equipment,
        EquipmentDefinition,
        Build,
        GameMap,
        Location,
        LocationDefinition,
        LocationMob,
        LocationVisit,
        MobDefinition,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class PostgresModule {}
