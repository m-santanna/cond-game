import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MobService } from './mob.service';
import { CreateMobDefinitionDto } from './dto/create-mob-definition.dto';
import { MobDefinition } from './entities/mob-definition.entity';

@Controller('mob')
export class MobController {
  constructor(private readonly mobService: MobService) {}

  @Get('definitions')
  async getAllDefinitions(): Promise<MobDefinition[]> {
    return this.mobService.getAllDefinitions();
  }

  @Get('definitions/:id')
  async getDefinitionById(@Param('id') id: string): Promise<MobDefinition> {
    return this.mobService.getDefinitionById(id);
  }

  @Post('definitions')
  async createDefinition(
    @Body() dto: CreateMobDefinitionDto,
  ): Promise<MobDefinition> {
    return this.mobService.createDefinition(dto);
  }
}
