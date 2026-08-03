import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChestService } from './chest.service';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import { ChestDefinition } from './entities/chest-definition.entity';
import { LootPool, LootPools } from './types/loot-pool.types';
import { ChestConfig, ChestConfigs } from './types/chest-config.types';

@Controller('chest')
export class ChestController {
  constructor(private readonly chestService: ChestService) {}

  @Get('definition/all')
  async getAllDefinitions(): Promise<ChestDefinition[]> {
    return await this.chestService.getAllDefinitions();
  }

  @Get('definition/:id')
  async getDefinitionById(@Param('id') id: string): Promise<ChestDefinition> {
    return await this.chestService.getDefinitionById(id);
  }

  @Post('definition')
  async createDefinition(
    @Body() dto: CreateChestDefinitionDto,
  ): Promise<ChestDefinition> {
    return await this.chestService.createDefinition(dto);
  }

  @Get('config/all')
  async getAllChestConfigs(): Promise<ChestConfigs> {
    return this.chestService.getAllChestConfigs();
  }

  @Get('config/:key')
  async getChestConfig(@Param('key') key: string): Promise<ChestConfig> {
    return this.chestService.getChestConfig(key);
  }

  @Get('pool/all')
  async getAllLootPools(): Promise<LootPools> {
    return this.chestService.getAllLootPools();
  }

  @Get('pool/:poolKey')
  async getLootPool(@Param('poolKey') poolKey: string): Promise<LootPool> {
    return this.chestService.getLootPool(poolKey);
  }
}
