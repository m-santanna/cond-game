import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDefinitionDto } from './dto/create-equipment-definition.dto';
import { EquipmentDefinition } from './entities/equipment-definition.entity';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('definition')
  async getAllDefinitions(): Promise<EquipmentDefinition[]> {
    return await this.equipmentService.getAllDefinitions();
  }

  @Get('definition/:id')
  async getDefinitionById(
    @Param('id') id: string,
  ): Promise<EquipmentDefinition> {
    return await this.equipmentService.getDefinitionByKey(id);
  }

  @Post('definition')
  async createDefinition(
    @Body() dto: CreateEquipmentDefinitionDto,
  ): Promise<EquipmentDefinition> {
    return await this.equipmentService.createDefinition(dto);
  }
}
