import dayjs from "dayjs";
import { getSunTimes } from "sunrise-sunset-js";

export const dayLengthMs = 24 * 60 * 60 * 1000;

const sunTimesCache = new Map<string, [number, number][][]>();

export const getSunLevelsForDay = (
  date: Date,
  latitude: number,
  longitude: number,
) => {
  const dayStr = dayjs(date).format("YYYY-MM-DD");
  if (sunTimesCache.has(dayStr)) {
    return sunTimesCache.get(dayStr) as [number, number][][];
  }

  const { sunrise, sunset, twilight } = getSunTimes(latitude, longitude, date);

  const startOfDayUnixMs = dayjs(date).startOf("day").valueOf();

  const blocksByLevel = [
    generateBlocks(
      toUnixMsOrNull(sunset),
      toUnixMsOrNull(sunrise),
      startOfDayUnixMs,
    ),
    generateBlocks(
      toUnixMsOrNull(twilight?.civilDusk),
      toUnixMsOrNull(twilight?.civilDawn),
      startOfDayUnixMs,
    ),
    generateBlocks(
      toUnixMsOrNull(twilight?.nauticalDusk),
      toUnixMsOrNull(twilight?.nauticalDawn),
      startOfDayUnixMs,
    ),
    generateBlocks(
      toUnixMsOrNull(twilight?.astronomicalDusk),
      toUnixMsOrNull(twilight?.astronomicalDawn),
      startOfDayUnixMs,
    ),
  ];

  sunTimesCache.set(dayStr, blocksByLevel);
  return blocksByLevel;
};

function toUnixMsOrNull(date: Date | null | undefined): number | null {
  return date?.getTime() ?? null;
}

// For each level:
// if start < end, generate block in the middle of day
// if start > end, generate blocks from midnight to start, and from end to next day's midnight
// Then display blocks as HTML divs with appropriate colors and positions.

// generateBlocks accepts times in Unix ms but returns fraction since midnight, as it's easier for positioning
function generateBlocks(
  start: number | null,
  end: number | null,
  startOfDay: number,
): [number, number][] {
  if (start === null || end === null) return [];

  const startNormalized = (start - startOfDay) / dayLengthMs;
  const endNormalized = (end - startOfDay) / dayLengthMs;

  if (endNormalized > startNormalized) {
    return [[startNormalized, endNormalized]];
  }
  return [
    [0, endNormalized],
    [startNormalized, 1],
  ];
}
