import { getSunrise, getSunset } from "sunrise-sunset-js";
import dayjs from "dayjs";
import config from "../config.ts";

type SunriseSunsetTimes = { sunrise: Date | null; sunset: Date | null };

const cache = new Map<string, SunriseSunsetTimes>();

export function getSunriseSunsetTimesByDay(day: Date): SunriseSunsetTimes {
  // TODO: check resistance to time zones - library generates times for the day in local time
  // e.g. given timestamp at 0:30 at July 10 in CEST, equal to 22:30 at July 9 in UTC, will
  // generate sunrise/sunset for July 10.

  // This will generate dayStr assuming local time, e.g. 2026-05-03T23:30:00.000Z will be converted to 2026-05-04
  const dayStr = dayjs(day).format("YYYY-MM-DD");
  if (!cache.has(dayStr)) {
    cache.set(dayStr, {
      sunrise: getSunrise(config.latitude, config.longitude, day),
      sunset: getSunset(config.latitude, config.longitude, day),
    });
  }

  return cache.get(dayStr)!;
}

// Calculate day/night for the purposes of opening/closing the roof.

// As we open/close roof to avoid damaging the camera by the Sun,
// (in addition to auto-closing by the microcontroller on detecting bad weather),
// and we want to be able to take flat frames during twilight,
// we use sunrise/sunset times (not twilight times) to determine when to open/close the roof.
export function isDayNight(now?: Date) {
  if (!now) now = new Date();

  const { sunrise, sunset } = getSunriseSunsetTimesByDay(now);
  if (!sunrise || !sunset) {
    // TODO: this will be valid if the observer is beyond the Arctic/Antarctic circle
    // (has polar day/night) - we should handle this case too
    return { isDay: false, isNight: false };
  }
  return {
    isDay: now >= sunrise && now <= sunset,
    isNight: now < sunrise || now > sunset,
  };
}
