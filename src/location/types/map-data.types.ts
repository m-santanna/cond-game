import { LocationStatus } from '../enums/location-status.enum';

export interface Location {
  id: string;
  locationDefinitionId: string;
  difficultyProfile: string;
  status: LocationStatus;
}

export interface LocationsMap {
  userId: string;
  createdAt: string;
  expiresAt: string;
  locations: Location[];
}
