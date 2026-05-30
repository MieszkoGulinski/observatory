import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

// Define all tables here

// Observations schedule to be performed.
export const observationsSchedule = sqliteTable("observations_schedule", {
  id: integer().primaryKey(),
  status: integer().notNull(), // 0=scheduled, 1=running, 2=completed, 3=failed

  startDate: integer().notNull(), // UNIX timestamp in ms
  endDate: integer(), // UNIX timestamp in ms, filled when the task is fully completed

  ra: real().notNull(), // Right Ascension, decimal degrees
  dec: real().notNull(), // Declination, decimal degrees
  expTimeMs: integer().notNull(), // exposure time in milliseconds
  expIso: integer().notNull(), // exposure ISO
  fileName: text(), // filled after file is created
  // shutter aperture and focusing cannot be controlled remotely and must be set manually
});

export type ObservationScheduleItem = typeof observationsSchedule.$inferSelect;
