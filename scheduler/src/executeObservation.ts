import { eq } from "drizzle-orm";
import db from "./db/index.ts";
import {
  observationsSchedule,
  type ObservationScheduleItem,
} from "./db/schema.ts";
import logger from "./logger.ts";
import type MotorController from "./motorController.ts";

export default async function executeObservation(
  task: ObservationScheduleItem,
  motorController: MotorController,
) {
  try {
    logger.info("Starting observation %d", task.id);

    // TODO submit command to microcontroller to rotate the mount to target coordinates
    // TODO take a picture using gphoto2 and download it to the disk

    // Simulate moving the mount to target coordinates
    await new Promise((resolve) => setTimeout(resolve, 5000));

    while (task.endDate < Date.now()) {
      if (
        !motorController.lastSensorState ||
        !motorController.lastSensorState.conditionsSuitableForObservation
      ) {
        break; // do not continue the observation if conditions are not suitable
      }
      logger.info("Taking an exposure for observation %d", task.id);

      // Simulate taking exposures
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Then after taking an exposure, write it to the database to exposures table

      logger.info("Completed an exposure for observation %d", task.id);
    }

    logger.info("Completed observation %d", task.id);
  } catch (error) {
    logger.error(error, "Error during observation");
  }
}
