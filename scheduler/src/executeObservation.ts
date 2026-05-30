import { eq } from "drizzle-orm";
import db from "./db/index.ts";
import { observationsSchedule } from "./db/schema.ts";
import logger from "./logger.ts";

export default async function executeObservation(id: number) {
  try {
    logger.info("Starting task %d", id);
    // Mark task as running
    db.update(observationsSchedule)
      .set({ status: 1 }) // 1=running
      .where(eq(observationsSchedule.id, id));

    // TODO submit command to microcontroller to rotate the mount to target coordinates
    // TODO take a picture using gphoto2

    db.update(observationsSchedule)
      .set({
        status: 2, // 2=completed
        endDate: Date.now(),
        // TODO add file name
      })
      .where(eq(observationsSchedule.id, id));
    logger.info("Completed task %d", id);
  } catch (error) {
    logger.error(error, "Fatal error executing observation");
    // Mark task as failed
    db.update(observationsSchedule)
      .set({ status: 3 }) // 3=failed
      .where(eq(observationsSchedule.id, id));
  }
}
