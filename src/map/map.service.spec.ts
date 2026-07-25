import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MapService } from './map.service';
import { Map as MapEntity } from './entities/map.entity';
import { LocationDefinition } from './entities/location-definition.entity';
import { Location } from './entities/location.entity';
import { ChestService } from '../chest/chest.service';

// Minimal ioredis stand-in: get + pipeline().set(...).exec()
class FakeRedis {
  store = new global.Map<string, string>();

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.store.get(key) ?? null);
  }

  pipeline() {
    const writes: [string, string][] = [];
    const chain = {
      set: (key: string, value: string) => {
        writes.push([key, value]);
        return chain;
      },
      exec: () => {
        writes.forEach(([key, value]) => this.store.set(key, value));
        return Promise.resolve([]);
      },
    };
    return chain;
  }
}

const buildDefinitions = (count: number): LocationDefinition[] =>
  Array.from(
    { length: count },
    (_, i) =>
      new LocationDefinition({
        id: `definition-${i}`,
        name: `definition-${i}`,
        chestDefinitionId: `chest-${i}`,
      }),
  );

describe('MapService', () => {
  let service: MapService;
  let redis: FakeRedis;
  let definitions: LocationDefinition[];
  let maps: MapEntity[];

  const mapRepo = {
    find: () => Promise.resolve(maps),
    findOne: ({ where }: { where: { id: string } }) =>
      Promise.resolve(maps.find((map) => map.id === where.id) ?? null),
    create: (dto: Partial<MapEntity>) => new MapEntity(dto),
    save: (map: MapEntity) => {
      map.id = map.id ?? `map-${maps.length}`;
      maps.push(map);
      return Promise.resolve(map);
    },
  };

  const definitionRepo = {
    // Fresh copy: generateLocations shuffles the array it is handed
    find: () => Promise.resolve([...definitions]),
    count: () => Promise.resolve(definitions.length),
  };

  beforeEach(() => {
    definitions = buildDefinitions(10);
    maps = [];
    redis = new FakeRedis();
    service = new MapService(
      mapRepo as unknown as Repository<MapEntity>,
      definitionRepo as unknown as Repository<LocationDefinition>,
      redis as never,
      {} as ChestService,
    );
  });

  const parse = (key: string): Location[] =>
    JSON.parse(redis.store.get(key) as string) as Location[];

  describe('generateLocations', () => {
    it('returns exactly map.size distinct locations with difficulty 1-5', async () => {
      const map = new MapEntity({ id: 'map-0', name: 'north', size: 4 });

      const locations = await service.generateLocations(map);

      expect(locations).toHaveLength(4);
      expect(new Set(locations.map((l) => l.locationDefinitionId)).size).toBe(
        4,
      );
      locations.forEach((location) => {
        expect(location.difficulty).toBeGreaterThanOrEqual(1);
        expect(location.difficulty).toBeLessThanOrEqual(5);
        expect(Number.isInteger(location.difficulty)).toBe(true);
      });
    });

    it('can fill a map that consumes every definition', async () => {
      const map = new MapEntity({ id: 'map-0', name: 'north', size: 10 });

      const locations = await service.generateLocations(map);

      expect(new Set(locations.map((l) => l.locationDefinitionId)).size).toBe(
        10,
      );
    });
  });

  describe('createMap', () => {
    it('rejects a size larger than the definition pool', async () => {
      await expect(
        service.createMap({ name: 'north', size: 11 }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(maps).toHaveLength(0);
    });

    it('writes both current and next locations', async () => {
      const map = await service.createMap({ name: 'north', size: 3 });

      expect(parse(`map:${map.id}:locations:current`)).toHaveLength(3);
      expect(parse(`map:${map.id}:locations:next`)).toHaveLength(3);
    });
  });

  describe('rotate', () => {
    it('promotes next to current and generates a fresh next', async () => {
      const map = await service.createMap({ name: 'north', size: 3 });
      const nextBefore = parse(`map:${map.id}:locations:next`);

      const promoted = await service.rotate(map.id);

      expect(promoted).toEqual(nextBefore);
      expect(parse(`map:${map.id}:locations:current`)).toEqual(nextBefore);
      expect(parse(`map:${map.id}:locations:next`)).not.toEqual(nextBefore);
    });

    it('regenerates next when Redis has been wiped', async () => {
      const map = await service.createMap({ name: 'north', size: 3 });
      redis.store.clear();

      const promoted = await service.rotate(map.id);

      expect(promoted).toHaveLength(3);
      expect(parse(`map:${map.id}:locations:next`)).toHaveLength(3);
    });
  });

  it('rotateAll rotates every map', async () => {
    const first = await service.createMap({ name: 'north', size: 3 });
    const second = await service.createMap({ name: 'south', size: 2 });
    const nextBefore = {
      first: parse(`map:${first.id}:locations:next`),
      second: parse(`map:${second.id}:locations:next`),
    };

    await service.rotateAll();

    expect(parse(`map:${first.id}:locations:current`)).toEqual(
      nextBefore.first,
    );
    expect(parse(`map:${second.id}:locations:current`)).toEqual(
      nextBefore.second,
    );
  });
});
