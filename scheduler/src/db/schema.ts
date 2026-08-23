import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";

// Define all tables here

export const starCatalog = sqliteTable("star_catalog", {
  id: integer().primaryKey(),
  starName: text().notNull(),
  ra: real().notNull(), // decimal degrees
  dec: real().notNull(),

  minVMag: real().notNull(), // brightest
  maxVMag: real().notNull(), // faintest
  periodDays: real(), // null for unknown period
  varType: text().notNull().default("--"), // type of variable star in AAVSO classification, e.g. EA, SRB, M, including subtype e.g. EA/RS, EA/SD
  normalizedVarType: text().notNull().default("--"), // as above but without subtypes, e.g. EA instead of EA/RS, EA/SD etc.
});

export type StarCatalogItem = typeof starCatalog.$inferSelect;
export const insertStarCatalogSchema = createInsertSchema(starCatalog);
export const updateStarCatalogSchema = createUpdateSchema(starCatalog);

// Observations schedule to be performed.
export const observationsSchedule = sqliteTable("observations_schedule", {
  id: integer().primaryKey(),
  label: text().notNull().default(""), // human readable label, usually star name copied from catalog
  note: text().notNull().default(""), // additional note

  // isCalibration should be set to true for bias and dark frames, as they are taken with lens cap closed
  // and don't need open roof or targeting, but must be false for flat frames.
  isCalibration: integer().default(0), // 0 = false, 1 = true; not boolean because SQLite doesn't support it

  // Target star may be null, particularly for calibration / test frames.
  // Note that RA/Dev below are centers of the field of view,
  // not the star's position, as the telescope may be pointed to a field
  // containing the target star at a non-central position, to observe
  // reference stars too.
  targetStarId: integer().references(() => starCatalog.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),

  startDate: integer().notNull(), // UNIX timestamp in ms
  endDate: integer().notNull(), // UNIX timestamp in ms

  ra: real().notNull(), // Right Ascension, decimal degrees (0 ... 360)
  dec: real().notNull(), // Declination, decimal degrees (-90 ... 90)

  expTimeMs: text().notNull(), // exposure time(s) in milliseconds, divided by commas if needed

  // Exposure time should be usually a single integer written as text, but stars with high dynamic range
  // will require multiple exposure times to be taken. In such cases, exposure times should be separated by commas.
  // Example: "60000,5000" (1 min, 5 s)

  // It's also possible to use this mechanism to take dark frames with varying exposure times,
  // e.g various times from 1 s to several minutes. As each exposure will have its temperature recorded,
  // it will be possible to calculate dependency between dark signal level, temperature and exposure time.

  // Timeframe between startDate and endDate must include time to set the telescope to the correct position,
  // take multiple exposures and download images from the camera.
  // If expTimeMs == 0, it means that it's a bias frame to be taken at minimal exposure time possible.
  // Exposure time must be calculated based on the star's magnitude.

  expIso: integer().notNull(), // exposure ISO
  // Note that shutter aperture and focusing cannot be controlled remotely, and must be set manually.
});

// Later it may be possible to e.g. control multiple telescopes independently

export type ObservationScheduleItem = typeof observationsSchedule.$inferSelect;
export const insertObservationSchema = createInsertSchema(observationsSchedule);
export const updateObservationSchema = createUpdateSchema(observationsSchedule);

// Individual exposures performed as part of observations
export const exposure = sqliteTable("exposure", {
  id: integer().primaryKey(),
  observationId: integer()
    .notNull()
    .references(() => observationsSchedule.id, {
      onDelete: "restrict", // prevent deleting observation that has exposures
      onUpdate: "cascade",
    }),
  startTimestamp: integer().notNull(), // UNIX timestamp in ms
  endTimestamp: integer().notNull(), // UNIX timestamp in ms

  fileUuid: text().notNull(), // uuid of the file in storage (not including file extension)
  fileHash: text().notNull(), // sha256 hash of the file

  // Actual values recorded during exposure
  cameraTemperature: real().notNull(), // Celsius
  airTemperature: real().notNull(), // Celsius
  humidity: real().notNull(), // percent
  skyTemperature: real().notNull(), // Celsius (from thermal camera attached to the telescope)
});

export type ExposureItem = typeof exposure.$inferSelect;

// System and sensor readouts
export const statistics = sqliteTable("statistics", {
  id: integer().primaryKey(),
  timestamp: integer().notNull(), // UNIX timestamp in ms

  // Sensor values
  cameraTemperature: real().notNull(), // Celsius
  airTemperature: real().notNull(), // Celsius
  humidity: real().notNull(), // percent
  batteryVoltage: real().notNull(), // V

  // OS statistics
  uptime: integer().notNull(), // seconds
  freeMemory: integer().notNull(), // bytes
  totalMemory: integer().notNull(), // bytes
  load1: real().notNull(), // 1 minute load
  load5: real().notNull(), // 5 minute load
  load15: real().notNull(), // 15 minute load
});

export type StatisticsItem = typeof statistics.$inferSelect;
export type InsertStatistics = typeof statistics.$inferInsert;
