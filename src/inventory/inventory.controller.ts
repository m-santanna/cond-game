import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddEquipmentDto } from './dto/add-equipment.dto';
import { Player } from 'src/auth/decorators/player.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('equipment')
  @Player()
  async getEquipments(@CurrentUser() user: AuthenticatedUser) {
    return await this.inventoryService.getEquipments(user.userId);
  }

  @Post('equipment')
  @Player()
  async addEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddEquipmentDto,
  ) {
    return await this.inventoryService.addEquipment(
      user.userId,
      dto.definitionId,
      {
        tier: dto.tier,
        quality: dto.quality,
      },
    );
  }

  @Delete('equipment/:equipmentId')
  @Player()
  async deleteEquipment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('equipmentId') equipmentId: string,
  ) {
    return await this.inventoryService.deleteEquipment(
      user.userId,
      equipmentId,
    );
  }
}
