import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { EquipmentModule } from '../equipment/equipment.module';
import { BuildModule } from '../build/build.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    EquipmentModule,
    BuildModule,
    CacheModule.register(),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
