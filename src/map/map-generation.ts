import {
  DIFFICULTY_TIERS,
  HEX_COORDS,
  MAP_LOCATION_COUNT,
  MIN_LOCATIONS_PER_DIFFICULTY,
  MIN_LOCATIONS_PER_LOOT_TYPE,
} from '../lib/constants';
import { LootType } from './enums/loot-type.enum';

export interface DefinitionLoot {
  id: string;
  lootType: LootType;
}

export interface Placement {
  definitionId: string;
  q: number;
  r: number;
  difficulty: number;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Loot balance: 3 random definitions per loot type, then fill the remaining
// slots from whatever is left. Loot is fixed per definition.
export function pickBalancedDefinitionIds(
  definitions: readonly DefinitionLoot[],
): string[] {
  const picked: string[] = [];

  for (const lootType of Object.values(LootType)) {
    const ofType = definitions.filter((d) => d.lootType === lootType);
    picked.push(
      ...shuffle(ofType)
        .slice(0, MIN_LOCATIONS_PER_LOOT_TYPE)
        .map((d) => d.id),
    );
  }

  const pickedSet = new Set(picked);
  const rest = shuffle(definitions.filter((d) => !pickedSet.has(d.id)))
    .slice(0, MAP_LOCATION_COUNT - picked.length)
    .map((d) => d.id);

  return [...picked, ...rest];
}

// Difficulty balance: 3 of each tier, remaining slots random. Independent of
// which definition/loot lands where — difficulty only scales loot quantity.
export function buildBalancedDifficulties(): number[] {
  const difficulties: number[] = DIFFICULTY_TIERS.flatMap((tier) =>
    Array<number>(MIN_LOCATIONS_PER_DIFFICULTY).fill(tier),
  );

  while (difficulties.length < MAP_LOCATION_COUNT) {
    difficulties.push(
      DIFFICULTY_TIERS[Math.floor(Math.random() * DIFFICULTY_TIERS.length)],
    );
  }

  return shuffle(difficulties);
}

export function generatePlacements(
  definitions: readonly DefinitionLoot[],
): Placement[] {
  const definitionIds = pickBalancedDefinitionIds(definitions);
  const difficulties = buildBalancedDifficulties();
  const coords = shuffle(HEX_COORDS);

  return definitionIds.map((definitionId, i) => ({
    definitionId,
    q: coords[i].q,
    r: coords[i].r,
    difficulty: difficulties[i],
  }));
}
