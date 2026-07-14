import { type StarCatalogEntry } from "../StarCatalog/types";

export type ScheduleEntry = {
  id: number;
  label: string;
  note: string;
  targetStarId: number | null;
  startDate: number;
  endDate: number;
  ra: number;
  dec: number;
  expTimeMs: string;
  expIso: number;
  targetStar: StarCatalogEntry | null;
};
