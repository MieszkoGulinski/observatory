import { eq } from "drizzle-orm";
import {
  observationsSchedule,
  type ObservationScheduleItem,
} from "../../db/schema.ts";
import logger from "../../logger.ts";
import type MountController from "../mountController/index.ts";
import db from "../../db/index.ts";

/**
 * Executes a single observation task, creating multiple exposures if needed, as long as the conditions are suitable for observation.
 */

export default async function executeObservation(
  task: ObservationScheduleItem,
  mountControllerClient: MountController,
) {
  try {
    logger.info("Starting observation %d", task.id);

    // TODO take a picture using gphoto2 and download it to the disk

    // TODO convert ra to lha
    await mountControllerClient.sendGotoCommand(task.ra, task.dec);

    while (task.endDate < Date.now()) {
      if (
        !mountControllerClient.lastSensorState ||
        !mountControllerClient.lastSensorState.conditionsSuitableForObservation
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
