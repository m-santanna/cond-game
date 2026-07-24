import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MapService } from './map.service';
import { Player } from '../auth/decorators/player.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @Player()
  async getMaps() {
    return await this.mapService.getMaps();
  }

  @Get('visits')
  @Player()
  async getVisits(@CurrentUser() user: AuthenticatedUser) {
    return await this.mapService.getVisits(user.userId);
  }

  @Get(':mapId')
  @Player()
  async getMap(@Param('mapId', ParseIntPipe) mapId: number) {
    return await this.mapService.getMap(mapId);
  }

  @Post('location/:locationId/visit')
  @Player()
  async visitLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('locationId') locationId: string,
  ) {
    return await this.mapService.visitLocation(user.userId, locationId);
  }
}
