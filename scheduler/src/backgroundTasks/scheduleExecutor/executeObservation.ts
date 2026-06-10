import { eq } from "drizzle-orm";
import {
  observationsSchedule,
  exposure,
  type ObservationScheduleItem,
} from "../../db/schema.ts";
import logger from "../../logger.ts";
import type MountController from "../mountController/index.ts";
import db from "../../db/index.ts";
import getLHA from "../../calculations/getLHA.ts";
import config from "../../config.ts";

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

    const lha = getLHA(new Date(), config.longitude, task.ra);
    await mountControllerClient.sendGotoCommand(lha, task.dec);

    while (task.endDate < Date.now()) {
      if (
        !mountControllerClient.lastSensorState ||
        !mountControllerClient.lastSensorState.conditionsSuitableForObservation
      ) {
        break; // do not continue the observation if conditions are not suitable
      }
      logger.info("Taking an exposure for observation %d", task.id);

      const startTimestamp = Date.now();
      // Simulate taking exposures
      await new Promise((resolve) => setTimeout(resolve, 1000));

      db.insert(exposure).values({
        observationId: task.id,
        startTimestamp,
        endTimestamp: Date.now(),

        fileName: "PLACEHOLDER",
        fileHash: "PLACEHOLDER",

        cameraTemperature:
          mountControllerClient.lastSensorState?.cameraTemperature,
        airTemperature: mountControllerClient.lastSensorState?.airTemperature,
        humidity: mountControllerClient.lastSensorState?.humidity,
        skyTemperature: mountControllerClient.lastSensorState?.skyTemperature,
      });

      logger.info("Completed an exposure for observation %d", task.id);
    }

    logger.info("Completed observation %d", task.id);
  } catch (error) {
    logger.error(error, "Error during observation");
  }
}
