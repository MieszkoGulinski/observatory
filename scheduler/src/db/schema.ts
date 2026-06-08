import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

// Define all tables here

// Observations schedule to be performed.
export const observationsSchedule = sqliteTable("observations_schedule", {
  id: integer().primaryKey(),
  note: text(), // manually added by user
  targetStar: text(), // target star name from astronomy catalog (may be empty for calibration / test frames)

  startDate: integer().notNull(), // UNIX timestamp in ms
  endDate: integer().notNull(), // UNIX timestamp in ms

  ra: real().notNull(), // Right Ascension, decimal degrees
  dec: real().notNull(), // Declination, decimal degrees
  expTimeMs: integer().notNull(), // exposure time in milliseconds
  expIso: integer().notNull(), // exposure ISO
  // Note that shutter aperture and focusing cannot be controlled remotely, and must be set manually.
});

// Later it may be possible to e.g. control multiple telescopes independently

export type ObservationScheduleItem = typeof observationsSchedule.$inferSelect;

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

  fileName: text(), // filled after file is created
  fileHash: text(), // sha256 hash of the file

  // Actual values recorded during exposure
  cameraTemperature: real(), // Celsius
  airTemperature: real(), // Celsius
  humidity: real(), // percent
  skyTemperature: real(), // Celsius (from thermal camera attached to the telescope)
});

export type ExposureItem = typeof exposure.$inferSelect;

// Statistics
export const statistics = sqliteTable("statistics", {
  id: integer().primaryKey(),
  timestamp: integer().notNull(), // UNIX timestamp in ms

  // Sensor values
  cameraTemperature: real(), // Celsius
  airTemperature: real(), // Celsius
  humidity: real(), // percent
  batteryVoltage: real(), // V

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
