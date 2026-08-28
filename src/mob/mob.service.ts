import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobDefinition } from './entities/mob-definition.entity';
import { CreateMobDefinitionDto } from './dto/create-mob-definition.dto';

@Injectable()
export class MobService {
  constructor(
    @InjectRepository(MobDefinition)
    private mobDefinitionRepo: Repository<MobDefinition>,
  ) {}

  async getDefinitionById(id: string): Promise<MobDefinition> {
    const definition = await this.mobDefinitionRepo.findOne({
      where: { id },
    });

    if (!definition) {
      throw new NotFoundException(`Mob definition ${id} not found`);
    }

    return definition;
  }

  async getDefinitionByKey(key: string): Promise<MobDefinition> {
    const definition = await this.mobDefinitionRepo.findOne({
      where: { key },
    });

    if (!definition) {
      throw new NotFoundException(`Mob definition with key ${key} not found`);
    }

    return definition;
  }

  async getAllDefinitions(): Promise<MobDefinition[]> {
    return this.mobDefinitionRepo.find();
  }

  async createDefinition(dto: CreateMobDefinitionDto): Promise<MobDefinition> {
    const newDefinition = this.mobDefinitionRepo.create(dto);
    return this.mobDefinitionRepo.save(newDefinition);
  }
}
