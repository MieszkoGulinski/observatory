export type Schedule = {
  id: number;
  label: string;
  note: string;
  targetStarId: number | null;

  startDate: number; // UNIX timestamp in ms
  endDate: number; // UNIX timestamp in ms

  ra: number; // Right Ascension, decimal degrees
  dec: number; // Declination, decimal degrees
  expTimeMs: number; // exposure time in milliseconds
  expIso: number; // exposure ISO
};

export type StarCatalogEntry = {
  id: number;
  starName: string;
  ra: number;
  dec: number;
  minVMag: number;
  maxVMag: number;
  periodDays: number | null;
  varType: string;
  normalizedVarType: string;
};

export type ScheduleWithTargetStar = Schedule & {
  targetStar: StarCatalogEntry | null;
};
