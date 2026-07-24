export const MAP_LOCATION_COUNT = 19;
export const MIN_LOCATIONS_PER_LOOT_TYPE = 3;
export const MIN_MOB_DEFINITIONS_PER_TIER = 1;
export const MOBS_PER_LOCATION = { min: 1, max: 3 };

// Radius-2 hex board: the 19 axial (q, r) coords where |q|<=2, |r|<=2, |q+r|<=2
export const HEX_COORDS: ReadonlyArray<{ q: number; r: number }> = [
  { q: -2, r: 0 },
  { q: -2, r: 1 },
  { q: -2, r: 2 },
  { q: -1, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: -1, r: 2 },
  { q: 0, r: -2 },
  { q: 0, r: -1 },
  { q: 0, r: 0 },
  { q: 0, r: 1 },
  { q: 0, r: 2 },
  { q: 1, r: -2 },
  { q: 1, r: -1 },
  { q: 1, r: 0 },
  { q: 1, r: 1 },
  { q: 2, r: -2 },
  { q: 2, r: -1 },
  { q: 2, r: 0 },
];

export const DIFFICULTY_TIERS = [1, 2, 3, 4, 5] as const;
export const MIN_LOCATIONS_PER_DIFFICULTY = 3;

// Difficulty scales loot QUANTITY only (consumed when loot dropping lands)
export const DIFFICULTY_LOOT_MULTIPLIER: Record<number, number> = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 3,
  5: 5,
};

export const MAP_REGEN_CRON = '0 0 * * 1'; // Monday 00:00
