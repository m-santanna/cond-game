import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentDefinition } from './entities/equipment-definition.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentDefinition)
    private definitionRepo: Repository<EquipmentDefinition>,
  ) {}

  async getDefinitionByKey(id: string): Promise<EquipmentDefinition> {
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
}
