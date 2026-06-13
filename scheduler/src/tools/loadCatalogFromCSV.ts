import "dotenv/config";
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import db from "../db/index.ts";
import { starCatalog, type StarCatalogItem } from "../db/schema.ts";

// Configure filters here:
// Do not add stars whose max magnitude (at faintest) is below...
const LIMIT_MAG = 12;
// Do not add stars whose amplitude is below...
const LIMIT_AMP = 0.2;

const fileName = process.argv[2];

const fileContent = fs.readFileSync(fileName, "utf-8");

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
}) as {
  Name: string; // e.g. 'RS And'
  AUID: string; // e.g. '000-BCS-094'
  Coords: string; // e.g. '23 55 21.75 +48 38 17.8'
  Const: string; // e.g. 'And'
  Type: string; // e.g. 'SRA'
  Period: string; // e.g. '136'
  Mag: string; // e.g. '7.0 - 9.4 V'
}[];

const entriesToAdd: Omit<StarCatalogItem, "id">[] = [];

records.forEach((r) => {
  // Ignore stars whose magnitude is not in V / CV filters
  if (!r.Mag.endsWith(" V") && !r.Mag.endsWith(" CV")) return;

  // The list from AAVSO contains two formats:
  // "6.85 - 9.0 V" and "11.99 (1.69) V"
  // Attempt to parse range, ignore invalid ones
  let minMag: number | null = null; // brightest
  let maxMag: number | null = null; // faintest

  const text = r.Mag.trim();
  const rangeMatch = text.match(
    /^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)\s+([A-Za-z]+)$/,
  );
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    if (!Number.isNaN(min)) minMag = min;
    const max = parseFloat(rangeMatch[2]);
    if (!Number.isNaN(max)) maxMag = max;
  }

  const ampMatch = text.match(
    /^(-?\d+(?:\.\d+)?)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)\s+([A-Za-z]+)$/,
  );
  if (ampMatch) {
    const avg = parseFloat(ampMatch[1]);
    const amp = parseFloat(ampMatch[2]);
    if (!Number.isNaN(avg) && !Number.isNaN(amp)) {
      minMag = avg - amp / 2;
      maxMag = avg + amp / 2;
    }
  }

  if (minMag === null || maxMag === null) return;
  if (maxMag > LIMIT_MAG) return;
  if (maxMag - minMag < LIMIT_AMP) return;

  // Decode coords
  const [raHour, raMin, raSec, decDeg, decMin, decSec] = r.Coords.split(
    " ",
  ).map((s) => parseFloat(s));

  // 0 ... 1
  const raNormalized = (raHour + raMin / 60 + raSec / 3600) / 24;

  // -90 ... 90
  const dec =
    (Math.abs(decDeg) + decMin / 60 + decSec / 3600) * Math.sign(decDeg);

  const period = parseFloat(r.Period);

  entriesToAdd.push({
    starName: r.Name,
    ra: raNormalized * 360,
    dec,
    minVMag: minMag,
    maxVMag: maxMag,
    periodDays: !Number.isNaN(period) ? period : null,
    varType: r.Type,
  });
});

console.log("Count of entries to write:", entriesToAdd.length);

db.transaction((tx) => {
  for (const e of entriesToAdd) {
    tx.insert(starCatalog).values(e).run();
  }
});

console.log("Done!");
