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

export type StarCatalogFilters = {
  normalizedVarTypes: string[];
};
