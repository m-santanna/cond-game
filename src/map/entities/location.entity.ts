// Not a TypeORM entity: locations are generated weekly and stored in Redis as a
// JSON array under `map:{mapId}:locations:{current|next}`.
export class Location {
  id: string;

  locationDefinitionId: string;

  chestDefinitionId: string;

  // 1-5, rolled at generation time
  difficulty: number;

  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }
}

export type LocationSlot = 'current' | 'next';
