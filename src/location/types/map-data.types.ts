import { LocationStatus } from '../enums/location-status.enum';

export interface Location {
  id: number;
  locationDefinitionId: string;
  difficultyProfile: string;
  status: LocationStatus;
}

export interface LocationsMap {
  playerId: string;
  createdAt: string;
  expiresAt: string;
  locations: Location[];
}
