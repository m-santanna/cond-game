import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MapService } from './map.service';
import { Admin } from '../auth/decorators/admin.decorator';
import { CreateMapDto } from './dto/create-map.dto';
import { CreateLocationDefinitionDto } from './dto/create-location-definition.dto';
import { CreateMobDefinitionDto } from './dto/create-mob-definition.dto';

@Controller('admin/map')
export class MapAdminController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @Admin()
  async createMap(@Body() dto: CreateMapDto) {
    return await this.mapService.createMap(dto.name);
  }

  @Post(':mapId/regenerate')
  @Admin()
  async regenerateMap(@Param('mapId', ParseIntPipe) mapId: number) {
    return await this.mapService.regenerateMap(mapId);
  }

  @Post('location-definition')
  @Admin()
  async createLocationDefinitions(
    @Body(new ParseArrayPipe({ items: CreateLocationDefinitionDto }))
    dtos: CreateLocationDefinitionDto[],
  ) {
    return await this.mapService.createLocationDefinitions(dtos);
  }

  @Get('location-definition')
  @Admin()
  async getLocationDefinitions() {
    return await this.mapService.getLocationDefinitions();
  }

  @Post('mob-definition')
  @Admin()
  async createMobDefinitions(
    @Body(new ParseArrayPipe({ items: CreateMobDefinitionDto }))
    dtos: CreateMobDefinitionDto[],
  ) {
    return await this.mapService.createMobDefinitions(dtos);
  }

  @Get('mob-definition')
  @Admin()
  async getMobDefinitions() {
    return await this.mapService.getMobDefinitions();
  }
}
