import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentDefinition } from './entities/equipment-definition.entity';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentDefinition)
    private definitionRepo: Repository<EquipmentDefinition>,
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
  ) {}

  async getDefinitionById(id: string): Promise<EquipmentDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
    });

    if (!definition) {
      throw new NotFoundException(`Equipment definition "${id}" not found`);
    }

    return definition;
  }

  async getAllDefinitions(): Promise<EquipmentDefinition[]> {
    return this.definitionRepo.find();
  }

  async createDefinition(
    definition: Partial<EquipmentDefinition>,
  ): Promise<EquipmentDefinition> {
    const newDefinition = this.definitionRepo.create(definition);
    return this.definitionRepo.save(newDefinition);
  }

  async createEquipment(equipment: Partial<Equipment>): Promise<Equipment> {
    const newEquipment = this.equipmentRepo.create(equipment);
    return this.equipmentRepo.save(newEquipment);
  }

  async getEquipmentById(
    equipmentId: string,
    inventoryId: string,
  ): Promise<Equipment | null> {
    return this.equipmentRepo.findOne({
      where: {
        id: equipmentId,
        inventoryId,
      },
      relations: { definition: true },
    });
  }

  async deleteEquipment(equipment: Equipment): Promise<void> {
    await this.equipmentRepo.remove(equipment);
  }
}
