import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentDefinition } from '../equipment/entities/equipment-definition.entity';
import { Build } from 'src/build/entities/build.entity';
import { ChestDefinition } from '../chest/entities/chest-definition.entity';
import { ChestLoot } from '../chest/entities/chest-loot.entity';
import { Map } from '../map/entities/map.entity';
import { LocationDefinition } from '../map/entities/location-definition.entity';

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
        ChestDefinition,
        ChestLoot,
        Map,
        LocationDefinition,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class PostgresModule {}
