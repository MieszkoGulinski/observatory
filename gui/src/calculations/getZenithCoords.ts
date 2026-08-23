// TODO the library has no TypeScript definitions and it gives compilation errors.

// @ts-ignore
import { DateToJD } from "astronomia/julian";
// @ts-ignore
import { apparent } from "astronomia/sidereal";

/**
 * Given time and location, calculate the RA and Dec of zenith. Needed to target camera at zenith for flat frames.
 */

export const getZenithCoords = (
  time: Date,
  latitude: number,
  longitude: number,
): [number, number] => {
  const jd = DateToJD(time); // Julian Day
  const gst = apparent(jd); // Greenwich Sidereal Time in seconds of time
  const gstDegrees = (gst / 86400) * 360; // Greenwich Sidereal Time in degrees
  const lstDegrees = gstDegrees + longitude; // Local Sidereal Time in degrees

  // lha = lstDegrees - ra ; at zenith lha=0, so ra = lstDegrees
  // dec = lat at zenith;
  return [lstDegrees, latitude];
};
