import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentModule } from '../equipment/equipment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Equipment]),
    EquipmentModule,
    CacheModule.register(),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
