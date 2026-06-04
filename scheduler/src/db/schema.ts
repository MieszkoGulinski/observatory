import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

// Define all tables here

// Observations schedule to be performed.
export const observationsSchedule = sqliteTable("observations_schedule", {
  id: integer().primaryKey(),
  status: integer().notNull(), // 0=scheduled, 1=running, 2=completed, 3=failed
  note: text(), // manually added by user
  targetStar: text(), // target star name (may be empty for calibration / test frames)

  startDate: integer().notNull(), // UNIX timestamp in ms
  endDate: integer(), // UNIX timestamp in ms, filled when the task is fully completed

  ra: real().notNull(), // Right Ascension, decimal degrees
  dec: real().notNull(), // Declination, decimal degrees
  expTimeMs: integer().notNull(), // exposure time in milliseconds
  expIso: integer().notNull(), // exposure ISO
  fileName: text(), // filled after file is created
  // shutter aperture and focusing cannot be controlled remotely and must be set manually

  // conditions when observation started
  temperature: real(), // Celsius
  humidity: real(), // percent
});

// Later it may be possible to e.g. control multiple telescopes independently

export type ObservationScheduleItem = typeof observationsSchedule.$inferSelect;

export const osLoadLog = sqliteTable("os_load_log", {
  id: integer().primaryKey(),
  timestamp: integer().notNull(), // UNIX timestamp in ms
  // OS statistics
  uptime: integer().notNull(), // seconds
  freeMemory: integer().notNull(), // bytes
  totalMemory: integer().notNull(), // bytes
  load1: real().notNull(), // 1 minute load
  load5: real().notNull(), // 5 minute load
  load15: real().notNull(), // 15 minute load
});

export type OsLoadLogItem = typeof osLoadLog.$inferSelect;
