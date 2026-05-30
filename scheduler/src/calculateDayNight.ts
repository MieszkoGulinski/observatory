import { getTwilight } from "sunrise-sunset-js";
import dayjs from "dayjs";
import config from "./config.ts";

const cache = new Map<
  string,
  { astronomicalDawn: Date; astronomicalDusk: Date }
>();

export function getTwilightByDay(day: Date) {
  const dayStr = dayjs(day).format("YYYY-MM-DD");
  if (!cache.has(dayStr)) {
    cache.set(dayStr, getTwilight(config.latitude, config.longitude, day));
  }

  return cache.get(dayStr)!;
}

export function isDayNight() {
  const now = new Date();
  const { astronomicalDawn, astronomicalDusk } = getTwilightByDay(now);
  return {
    isDay: now >= astronomicalDawn && now <= astronomicalDusk,
    isNight: now < astronomicalDawn || now > astronomicalDusk,
  };
}

export const getObservationTimesForUpcomingDays = (
  numberOfDays: number = 365,
  offsetDays: number = 0,
) => {
  const times: Array<{
    day: string;
    astronomicalDawn: Date;
    astronomicalDusk: Date;
  }> = [];
  for (let i = 0; i < numberOfDays; i++) {
    const day = dayjs()
      .add(i + offsetDays, "day")
      .toDate();
    times.push({
      day: dayjs(day).format("YYYY-MM-DD"),
      ...getTwilightByDay(day),
    });
  }
  return times;
};
