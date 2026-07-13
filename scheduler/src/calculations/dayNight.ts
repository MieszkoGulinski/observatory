import * as SunCalc from "suncalc";
import config from "../config.ts";

// Calculate day/night for the purposes of opening/closing the roof.

// As we open/close roof to avoid damaging the camera by the Sun,
// (in addition to auto-closing by the microcontroller on detecting bad weather),
// and we want to be able to take flat frames during twilight,
// we use sunrise/sunset times (not twilight times) to determine when to open/close the roof.

export function isDaylight(now?: Date): boolean {
  if (!now) now = new Date();

  const { altitude } = SunCalc.getPosition(
    now,
    config.latitude,
    config.longitude,
  );

  return altitude > 0;
}
