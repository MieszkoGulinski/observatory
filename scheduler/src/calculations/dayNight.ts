import {
  getSunrise,
  getSunset,
  getTwilight,
  type TwilightTimes,
} from "sunrise-sunset-js";
import dayjs from "dayjs";
import config from "../config.ts";

type TwilightAndSunTimes = TwilightTimes & { sunrise: Date; sunset: Date };

const cache = new Map<string, TwilightAndSunTimes>();

export function getTwilightByDay(day: Date): TwilightAndSunTimes {
  const dayStr = dayjs(day).format("YYYY-MM-DD");
  if (!cache.has(dayStr)) {
    cache.set(dayStr, {
      ...getTwilight(config.latitude, config.longitude, day),
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
export function isDayNight() {
  const now = new Date();
  const { sunrise, sunset } = getTwilightByDay(now);
  return {
    isDay: now >= sunrise && now <= sunset,
    isNight: now < sunrise || now > sunset,
  };
}
