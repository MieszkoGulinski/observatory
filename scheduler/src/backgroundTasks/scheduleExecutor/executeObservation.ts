import { exposure, type ObservationScheduleItem } from "../../db/schema.ts";
import logger from "../../logger.ts";
import type MountController from "../mountController/index.ts";
import db from "../../db/index.ts";
import executeSingleExposure from "./executeSingleExposure.ts";

/**
 * Executes a single observation task, creating multiple exposures if needed.
 *
 * Note that this function may be called multiple times for the same observation. This way, a currently running
 * observation can be replaced with an incoming change - this may be needed if the observatory is listening to
 * alerts.
 */

export default async function executeObservation(
  task: ObservationScheduleItem,
  mountControllerClient: MountController,
) {
  try {
    const expTimes = task.expTimeMs
      .split(",")
      .map((expTime) => Number(expTime.trim()));

    for (const expTime of expTimes) {
      // should not happen, needed only to satisfy TypeScript
      if (!mountControllerClient.lastSensorState) {
        break;
      }
      logger.info("Taking an exposure for observation %d", task.id);

      const startTimestamp = Date.now();

      const { fileUuid, fileHash } = await executeSingleExposure(
        expTime,
        task.expIso,
      );

      db.insert(exposure).values({
        observationId: task.id,
        startTimestamp,
        endTimestamp: Date.now(),
        fileUuid,
        fileHash,
        cameraTemperature:
          mountControllerClient.lastSensorState.cameraTemperature,
        airTemperature: mountControllerClient.lastSensorState.airTemperature,
        humidity: mountControllerClient.lastSensorState.humidity,
        skyTemperature: mountControllerClient.lastSensorState.skyTemperature,
      });

      logger.info("Completed an exposure for observation %d", task.id);
    }
  } catch (error) {
    logger.error(error, "Error during observation");
  }
}
