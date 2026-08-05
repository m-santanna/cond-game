export interface DifficultyProfile {
  difficulty: number;
  rewardProfileKey: string;
}

export interface DifficultyProfiles {
  [key: string]: DifficultyProfile;
}
