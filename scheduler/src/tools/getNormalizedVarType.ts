function getNormalizedVarType(varType: string): string {
  // Remove additional information from varType, e.g.:
  // - EA/GS > EA
  // - LC: > LC
  // - EA+DSCT > EA
  // - DSCTC > DSCT (as DSCTC is a subset of DSCT with low amplitudes)
  // Also, merge unknown star types into single "?"

  let normalizedVarType = varType;

  // Merge "unknown" variability types into single
  if (
    normalizedVarType === "--" ||
    normalizedVarType === "*" ||
    normalizedVarType.startsWith("VAR") ||
    normalizedVarType.startsWith("MISC")
  )
    normalizedVarType = "?";

  normalizedVarType = normalizedVarType.split("/")[0];
  normalizedVarType = normalizedVarType.split(":")[0];
  normalizedVarType = normalizedVarType.split("|")[0];
  normalizedVarType = normalizedVarType.split("+")[0];
  normalizedVarType = normalizedVarType.split("-")[0];
  normalizedVarType = normalizedVarType.replaceAll("(B)", "");

  // Delta Scuti variables
  if (normalizedVarType === "DSCTC") normalizedVarType = "DSCT";
  if (normalizedVarType === "HADS") normalizedVarType = "DSCT";

  // Ending with "S" means "low amplitude"
  if (normalizedVarType === "ACEPS") normalizedVarType = "ACEP";
  if (normalizedVarType === "BCEPS") normalizedVarType = "BCEP";
  if (normalizedVarType === "DCEPS") normalizedVarType = "DCEP";
  if (normalizedVarType === "CWBS") normalizedVarType = "CWB";

  return normalizedVarType;
}

export default getNormalizedVarType;
