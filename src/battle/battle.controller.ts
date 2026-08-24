import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BattleService } from './battle.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Battle } from './types/battle.types';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post()
  async createBattle(@Body() dto: CreateBattleDto): Promise<Battle> {
    return await this.battleService.createBattle(dto);
  }

  @Get(':id')
  async getBattle(@Param('id') battleId: string): Promise<Battle> {
    return await this.battleService.getBattleById(battleId);
  }
}
