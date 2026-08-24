import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { EquipmentCondition } from '../equipment/enums/equipment-condition.enum';
import { EquipmentType } from '../equipment/enums/equipment-type.enum';
import * as powerMapping from '../equipment/configs/power-mapping.json';
import { EquipmentService } from '../equipment/equipment.service';
import { BuildService } from '../build/build.service';
import { Build } from '../build/entities/build.entity';
import { Equipment } from '../equipment/entities/equipment.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    private equipmentService: EquipmentService,
    private buildService: BuildService,
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

    const savedInventory = await this.inventoryRepo.save(inventory);
    await this.buildService.createBuild(savedInventory.id);

    return savedInventory;
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
    attributes: { tier: number; condition: EquipmentCondition },
  ): Promise<Equipment> {
    const inventory = await this.getInventoryByUserId(userId);
    const definition =
      await this.equipmentService.getDefinitionById(definitionId);

    const tier = attributes.tier || 1;
    const condition = attributes.condition || EquipmentCondition.SOLID;
    const power = this.calculateEquipmentPower(tier, condition);

    return await this.equipmentService.createEquipment({
      inventoryId: inventory.id,
      definitionId: definition.id,
      tier,
      condition,
      power,
    });
  }

  async deleteEquipment(userId: string, equipmentId: string): Promise<void> {
    const inventory = await this.getInventoryByUserId(userId);

    const equipment = await this.equipmentService.getEquipmentById(
      equipmentId,
      inventory.id,
    );

    if (!equipment) {
      throw new NotFoundException('Equipment not found in inventory');
    }

    await this.equipmentService.deleteEquipment(equipment);
  }

  calculateEquipmentPower(tier: number, condition: string): number {
    const tierPower = powerMapping.tier[tier] || 100;
    const conditionBonus = powerMapping.condition[condition] || 0;
    return tierPower + conditionBonus;
  }

  async getBuild(userId: string): Promise<{
    weapon: Equipment | null;
    offhand: Equipment | null;
    helmet: Equipment | null;
    armor: Equipment | null;
    boots: Equipment | null;
  }> {
    return await this.buildService.getBuildByUserId(userId);
  }

  async equip(userId: string, equipmentId: string): Promise<Build> {
    const inventory = await this.getInventoryByUserId(userId);

    const equipment = await this.equipmentService.getEquipmentById(
      equipmentId,
      inventory.id,
    );

    if (!equipment) {
      throw new NotFoundException('Equipment not found in inventory');
    }

    return await this.buildService.equip(
      userId,
      equipment.definition.type,
      equipment,
    );
  }

  async unequip(userId: string, equipmentType: EquipmentType): Promise<Build> {
    return await this.buildService.unequip(userId, equipmentType);
  }
}
