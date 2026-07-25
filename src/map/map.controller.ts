import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { CreateLocationDefinitionDto } from './dto/create-location-definition.dto';
import { Map } from './entities/map.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { Location } from './entities/location.entity';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('location/definition/all')
  async getAllDefinitions(): Promise<LocationDefinition[]> {
    return await this.mapService.getAllDefinitions();
  }

  @Get('location/definition/:id')
  async getDefinitionById(
    @Param('id') id: string,
  ): Promise<LocationDefinition> {
    return await this.mapService.getDefinitionById(id);
  }

  @Post('location/definition')
  async createDefinition(
    @Body() dto: CreateLocationDefinitionDto,
  ): Promise<LocationDefinition> {
    return await this.mapService.createDefinition(dto);
  }

  @Get('all')
  async getAllMaps(): Promise<Map[]> {
    return await this.mapService.getAllMaps();
  }

  @Get(':id')
  async getMapById(@Param('id') id: string): Promise<Map> {
    return await this.mapService.getMapById(id);
  }

  @Post()
  async createMap(@Body() dto: CreateMapDto): Promise<Map> {
    return await this.mapService.createMap(dto);
  }

  @Get(':id/locations')
  async getLocations(@Param('id') id: string): Promise<Location[]> {
    return await this.mapService.getLocations(id, 'current');
  }

  @Get(':id/locations/next')
  async getNextLocations(@Param('id') id: string): Promise<Location[]> {
    return await this.mapService.getLocations(id, 'next');
  }

  @Post(':id/rotate')
  async rotate(@Param('id') id: string): Promise<Location[]> {
    return await this.mapService.rotate(id);
  }
}
