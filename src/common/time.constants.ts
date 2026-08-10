export const Time = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

export const TimeInSeconds = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
} as const;
