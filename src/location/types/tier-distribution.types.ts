export interface TierEntry {
  tier: number;
  probability: number;
}

export interface TierDistribution {
  entries: TierEntry[];
}

export interface TierDistributions {
  [key: string]: TierDistribution;
}
