import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddEquipmentDto } from './dto/add-equipment.dto';
import { Standard } from 'src/auth/decorators/standard.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { EquipmentType } from '../equipment/enums/equipment-type.enum';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('equipment')
  @Standard()
  async getEquipments(@CurrentUser() user: AuthenticatedUser) {
    return await this.inventoryService.getEquipments(user.userId);
  }

  @Post('equipment')
  @Standard()
  async addEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddEquipmentDto,
  ) {
    return await this.inventoryService.addEquipment(
      user.userId,
      dto.definitionId,
      {
        tier: dto.tier,
        condition: dto.condition,
      },
    );
  }

  @Delete('equipment/:equipmentId')
  @Standard()
  async deleteEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('equipmentId') equipmentId: string,
  ) {
    return await this.inventoryService.deleteEquipment(
      user.userId,
      equipmentId,
    );
  }

  @Get('build')
  @Standard()
  async getBuild(@CurrentUser() user: AuthenticatedUser) {
    return await this.inventoryService.getBuild(user.userId);
  }

  @Post('build/:equipmentId')
  @Standard()
  async equipEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('equipmentId') equipmentId: string,
  ) {
    return await this.inventoryService.equip(user.userId, equipmentId);
  }

  @Delete('build/:equipmentType')
  @Standard()
  async unequipEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('equipmentType') equipmentType: EquipmentType,
  ) {
    return await this.inventoryService.unequip(user.userId, equipmentType);
  }
}
