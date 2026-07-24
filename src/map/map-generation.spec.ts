import {
  DefinitionLoot,
  buildBalancedDifficulties,
  generatePlacements,
} from './map-generation';
import { LootType } from './enums/loot-type.enum';
import {
  HEX_COORDS,
  MAP_LOCATION_COUNT,
  MIN_LOCATIONS_PER_DIFFICULTY,
  MIN_LOCATIONS_PER_LOOT_TYPE,
} from '../lib/constants';

function buildCatalog(): DefinitionLoot[] {
  const lootTypes = Object.values(LootType);
  return Array.from({ length: 56 }, (_, i) => ({
    id: `def-${i}`,
    lootType: lootTypes[i % lootTypes.length],
  }));
}

describe('map generation', () => {
  const catalog = buildCatalog();

  it('generates balanced placements', () => {
    for (let run = 0; run < 50; run++) {
      const placements = generatePlacements(catalog);

      expect(placements).toHaveLength(MAP_LOCATION_COUNT);

      const definitionIds = placements.map((p) => p.definitionId);
      expect(new Set(definitionIds).size).toBe(MAP_LOCATION_COUNT);

      const coords = placements.map((p) => `${p.q},${p.r}`);
      expect(new Set(coords).size).toBe(MAP_LOCATION_COUNT);
      const validCoords = new Set(HEX_COORDS.map((c) => `${c.q},${c.r}`));
      coords.forEach((c) => expect(validCoords.has(c)).toBe(true));

      const lootById = new Map(catalog.map((d) => [d.id, d.lootType]));
      for (const lootType of Object.values(LootType)) {
        const count = definitionIds.filter(
          (id) => lootById.get(id) === lootType,
        ).length;
        expect(count).toBeGreaterThanOrEqual(MIN_LOCATIONS_PER_LOOT_TYPE);
      }
    }
  });

  it('balances difficulties across tiers 1-5', () => {
    for (let run = 0; run < 50; run++) {
      const difficulties = buildBalancedDifficulties();

      expect(difficulties).toHaveLength(MAP_LOCATION_COUNT);
      for (const tier of [1, 2, 3, 4, 5]) {
        const count = difficulties.filter((d) => d === tier).length;
        expect(count).toBeGreaterThanOrEqual(MIN_LOCATIONS_PER_DIFFICULTY);
      }
      difficulties.forEach((d) => {
        expect(d).toBeGreaterThanOrEqual(1);
        expect(d).toBeLessThanOrEqual(5);
      });
    }
  });
});
