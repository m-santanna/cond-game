import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChestService } from './chest.service';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import { ChestDefinition } from './entities/chest-definition.entity';
import { LootPool, LootPools } from './types/loot-pool.types';
import { ChestProfile, ChestProfiles } from './types/chest-profile.types';

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

  @Get('profile/all')
  async getAllChestProfiles(): Promise<ChestProfiles> {
    return this.chestService.getAllChestProfiles();
  }

  @Get('profile/:key')
  async getChestProfile(@Param('key') key: string): Promise<ChestProfile> {
    return this.chestService.getChestProfile(key);
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
