// TODO the library has no TypeScript definitions and it gives compilation errors.

// @ts-ignore
import { DateToJD } from "astronomia/julian";
// @ts-ignore
import { apparent } from "astronomia/sidereal";

/**
 * Get the Local Hour Angle for a given time and Right Ascension.
 *
 * @param time
 * @param longitude Longitude of the observer in degrees, positive = eastern hemisphere, negative = western hemisphere
 * @param ra Right Ascension of the object in degrees
 * @returns Local Hour Angle in degrees, 0 = on meridian, negative = object will transit, positive = object has transited
 */

function getLHA(time: Date, longitude: number, ra: number): number {
  const jd = DateToJD(time); // Julian Day
  const gst = apparent(jd); // Greenwich Sidereal Time in seconds of time
  const gstDegrees = (gst / 86400) * 360; // Greenwich Sidereal Time in degrees
  const lstDegrees = gstDegrees + longitude; // Local Sidereal Time in degrees
  let lha = lstDegrees - ra; // Local Hour Angle in degrees

  // Normalize LHA to range -180 to 180
  while (lha < -180) lha += 360;
  while (lha > 180) lha -= 360;

  return lha;
}

export default getLHA;
