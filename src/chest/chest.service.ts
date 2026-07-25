import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChestDefinition } from './entities/chest-definition.entity';
import { ChestLoot } from './entities/chest-loot.entity';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import { CreateChestLootDto } from './dto/create-chest-loot.dto';

@Injectable()
export class ChestService {
  constructor(
    @InjectRepository(ChestDefinition)
    private definitionRepo: Repository<ChestDefinition>,
    @InjectRepository(ChestLoot)
    private lootRepo: Repository<ChestLoot>,
  ) {}

  async getDefinitionById(id: string): Promise<ChestDefinition> {
    const definition = await this.definitionRepo.findOne({
      where: { id },
      relations: { loot: true },
    });

    if (!definition) {
      throw new NotFoundException(`Chest definition ${id} not found`);
    }

    return definition;
  }

  async getAllDefinitions(): Promise<ChestDefinition[]> {
    return this.definitionRepo.find({ relations: { loot: true } });
  }

  async createDefinition(
    dto: CreateChestDefinitionDto,
  ): Promise<ChestDefinition> {
    const newDefinition = this.definitionRepo.create(dto);
    return this.definitionRepo.save(newDefinition);
  }

  async getLootById(id: string): Promise<ChestLoot> {
    const loot = await this.lootRepo.findOne({
      where: { id },
      relations: { chestDefinition: true },
    });

    if (!loot) {
      throw new NotFoundException(`Chest loot "${id}" not found`);
    }

    return loot;
  }

  async getAllLoot(): Promise<ChestLoot[]> {
    return this.lootRepo.find({ relations: { chestDefinition: true } });
  }

  async createLoot(dto: CreateChestLootDto): Promise<ChestLoot> {
    const definition = await this.definitionRepo.findOne({
      where: { id: dto.chestDefinitionId },
    });

    if (!definition) {
      throw new NotFoundException(
        `Chest definition "${dto.chestDefinitionId}" not found`,
      );
    }

    const existingLoot = await this.lootRepo.find({
      where: { chestDefinitionId: dto.chestDefinitionId },
    });

    const currentTotalWeight = existingLoot.reduce(
      (sum, loot) => sum + Number(loot.weight),
      0,
    );

    const newTotalWeight = currentTotalWeight + Number(dto.weight);

    if (newTotalWeight > 100) {
      throw new BadRequestException(
        `Total weight cannot exceed 100%. Current: ${currentTotalWeight}%`,
      );
    }

    const newLoot = this.lootRepo.create(dto);
    return this.lootRepo.save(newLoot);
  }
}
