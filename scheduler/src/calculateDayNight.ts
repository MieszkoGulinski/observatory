import { getTwilight } from "sunrise-sunset-js";

export function isDayNight() {
  const now = new Date();
  // TODO pass the coordinates as config
  const { astronomicalDawn, astronomicalDusk } = getTwilight(54, 18, now);
  return {
    isDay: now >= astronomicalDawn && now <= astronomicalDusk,
    isNight: now < astronomicalDawn || now > astronomicalDusk,
  };
}
