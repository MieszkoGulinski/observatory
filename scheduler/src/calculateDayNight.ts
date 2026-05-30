import { getTwilight } from "sunrise-sunset-js";

function isDayNight() {
  const now = new Date();
  const { astronomicalDawn, astronomicalDusk } = getTwilight(54, 28, now);
  return {
    isDay: now >= astronomicalDawn && now <= astronomicalDusk,
    isNight: now < astronomicalDawn || now > astronomicalDusk,
  };
}

export default isDayNight;
