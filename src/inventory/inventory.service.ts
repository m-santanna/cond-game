import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { EquipmentQuality } from '../equipment/enums/equipment-quality.enum';
import * as powerMapping from '../equipment/configs/power-mapping.json';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentService } from '../equipment/equipment.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    private equipmentService: EquipmentService,
  ) {}

  async createInventory(userId: string): Promise<Inventory> {
    const existing = await this.inventoryRepo.findOne({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException('Inventory already exists for this user');
    }

    const inventory = this.inventoryRepo.create({
      userId,
    });

    return await this.inventoryRepo.save(inventory);
  }

  async getInventoryByUserId(userId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: { userId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async getEquipments(userId: string): Promise<Equipment[]> {
    const inventory = await this.inventoryRepo.findOne({
      where: { userId },
      relations: {
        equipment: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory.equipment;
  }

  async addEquipment(
    userId: string,
    definitionId: string,
    attributes: { tier: number; quality: EquipmentQuality },
  ): Promise<Equipment> {
    const inventory = await this.getInventoryByUserId(userId);
    const definition =
      await this.equipmentService.getDefinitionByKey(definitionId);

    const tier = attributes.tier || 1;
    const quality = attributes.quality || EquipmentQuality.COMMON;
    const power = this.calculateEquipmentPower(tier, quality);

    const equipment = this.equipmentRepo.create({
      inventoryId: inventory.id,
      definitionId: definition.id,
      tier,
      quality,
      power,
    });

    return await this.equipmentRepo.save(equipment);
  }

  async deleteEquipment(userId: string, equipmentId: string): Promise<void> {
    const inventory = await this.getInventoryByUserId(userId);

    const equipment = await this.equipmentRepo.findOne({
      where: {
        id: equipmentId,
        inventoryId: inventory.id,
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found in inventory');
    }

    await this.equipmentRepo.remove(equipment);
  }

  calculateEquipmentPower(tier: number, quality: string): number {
    const tierPower = powerMapping.tier[tier] || 100;
    const qualityBonus = powerMapping.quality[quality] || 0;
    return tierPower + qualityBonus;
  }
}
