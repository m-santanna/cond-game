import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChestService } from './chest.service';
import { CreateChestDefinitionDto } from './dto/create-chest-definition.dto';
import { CreateChestLootDto } from './dto/create-chest-loot.dto';
import { ChestDefinition } from './entities/chest-definition.entity';
import { ChestLoot } from './entities/chest-loot.entity';

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

  @Get('loot/all')
  async getAllLoot(): Promise<ChestLoot[]> {
    return await this.chestService.getAllLoot();
  }

  @Get('loot/:id')
  async getLootById(@Param('id') id: string): Promise<ChestLoot> {
    return await this.chestService.getLootById(id);
  }

  @Post('loot')
  async createLoot(@Body() dto: CreateChestLootDto): Promise<ChestLoot> {
    return await this.chestService.createLoot(dto);
  }
}
