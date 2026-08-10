export function selectWeightedRandom<
  T extends { probability: number },
  K extends keyof T,
>(options: T[], valueKey: K): T[K] {
  const rand = Math.random();

  const selected = options.reduce<{ cumulative: number; result: T | null }>(
    (acc, option) => {
      if (acc.result !== null) return acc;

      const newCumulative = acc.cumulative + option.probability;
      if (rand < newCumulative) {
        return { cumulative: newCumulative, result: option };
      }

      return { cumulative: newCumulative, result: null };
    },
    { cumulative: 0, result: null },
  );

  const winner = selected.result ?? options[options.length - 1];
  return winner[valueKey];
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
