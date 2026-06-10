export type Schedule = {
  id: number;
  note: string | null;
  targetStar: string | null;

  startDate: number; // UNIX timestamp in ms
  endDate: number; // UNIX timestamp in ms

  ra: number; // Right Ascension, decimal degrees
  dec: number; // Declination, decimal degrees
  expTimeMs: number; // exposure time in milliseconds
  expIso: number; // exposure ISO
};
