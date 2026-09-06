import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentDefinition } from './entities/equipment-definition.entity';
import { Equipment } from './entities/equipment.entity';
import cardsByType from '../card/configs/cards-by-type.json';

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

  async getDefinitionByKey(key: string): Promise<EquipmentDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { key },
    });

    if (!definition) {
      throw new NotFoundException(
        `Equipment definition with key "${key}" not found`,
      );
    }

    return definition;
  }

  async getAllDefinitions(): Promise<EquipmentDefinition[]> {
    return this.definitionRepo.find();
  }

  async createDefinition(
    definition: Partial<EquipmentDefinition>,
  ): Promise<EquipmentDefinition> {
    const newDefinition = this.definitionRepo.create({
      ...definition,
      cards: cardsByType[definition.type],
    });
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
