export interface RewardProfile {
  tierDistributionKey: string;
  conditionDistributionKey: string;
}

export interface RewardProfiles {
  [key: string]: RewardProfile;
}
