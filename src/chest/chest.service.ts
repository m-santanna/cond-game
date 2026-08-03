import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';

@Injectable()
export class ChestService {
  constructor(
    @InjectRepository(ChestDefinition)
    private definitionRepo: Repository<ChestDefinition>,
  ) {}

  async getDefinitionById(id: string): Promise<ChestDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
    });

    if (!definition) {
      throw new NotFoundException(`Chest definition ${id} not found`);
    }

    return definition;
  }

  async getDefinitionByKey(key: string): Promise<ChestDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { key },
    });

    if (!definition) {
      throw new NotFoundException(
        `Chest definition with key "${key}" not found`,
      );
    }

    return definition;
  }

  async getAllDefinitions(): Promise<ChestDefinition[]> {
    return this.definitionRepo.find();
  }

  async createDefinition(
    dto: CreateChestDefinitionDto,
  ): Promise<ChestDefinition> {
    const newDefinition = this.definitionRepo.create(dto);
    return this.definitionRepo.save(newDefinition);
  }
}
