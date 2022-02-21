import { Duration } from 'luxon';

export function durationToSeconds(duration: string = ''): number {
  if (duration.includes(':')) {
    return Duration.fromISOTime(duration).as('seconds');
  }

  return Number(duration);
};

export function secondsToDuration(seconds: number = 0): String {
  const sec = (seconds || 0);

  const duration = Duration.fromDurationLike(sec * 1000);

  if (sec > 3600) {
    return duration.toFormat("h 'hr' m 'min'");
  }

  if (sec >= 60) {
    return duration.toFormat("m 'minutes'");
  }

  return duration.toFormat("s 'sec'");
};
