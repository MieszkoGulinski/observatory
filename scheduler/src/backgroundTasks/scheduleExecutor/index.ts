import logger from "../../logger.ts";
import type MountController from "../mountController/index.ts";
import { delay } from "../../utils.ts";
import db from "../../db/index.ts";
import {
  observationsSchedule,
  type ObservationScheduleItem,
} from "../../db/schema.ts";
import { and, gt, lte } from "drizzle-orm";
import executeObservation from "./executeObservation.ts";
import { isDaylight } from "../../calculations/dayNight.ts";
import config from "../../config.ts";
import getLHA from "../../calculations/getLHA.ts";

const POLLING_INTERVAL = 5000; // 5 s

/**
 * Executes the observation schedule by reading tasks from the database and executing them, and opening/closing the roof as needed.
 *
 * This is effectively the main loop of the application. Currently it's the only place where it's safe to submit commands to the mount controller,
 * as no more than one command can be executed concurrently.
 *
 * Note that each execution of the while loop MUST always have at least one await - this is absolutely necessary so that other
 * operations, in different "threads", could run.
 */

class ScheduleExecutor {
  mountControllerClient: MountController;

  constructor(mountControllerClient: MountController) {
    this.mountControllerClient = mountControllerClient;
  }

  async run() {
    try {
      while (true) {
        // Initial wait for MCU status data
        if (this.mountControllerClient.lastSensorState === null) {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // Note that if the microcontroller detects unsuitable conditions, it will close the roof independently of these commands.

        const isDay = isDaylight();
        const { roofState, conditionsSuitableForObservation } =
          this.mountControllerClient.lastSensorState;

        if (
          roofState === "CLOSED" &&
          conditionsSuitableForObservation &&
          !isDay
        ) {
          await this.mountControllerClient.sendOpenCommand();
          continue;
        }
        if ((roofState === "OPEN" || roofState === "OPENING") && isDay) {
          await this.mountControllerClient.sendCloseCommand();
          await this.mountControllerClient.sendStopCommand();
          continue;
        }

        // Poll for new scheduled observation.
        // Polling, even if less efficient than event-based notification,
        // is simpler to implement and easier to understand (less risk of bugs).
        // The code detects if an observation needs to be started, and if so, executes it.

        const task = this.readScheduledTask();

        if (!task) {
          await this.mountControllerClient.sendStopCommand();
          await delay(POLLING_INTERVAL);
          continue;
        }

        if (!task.isCalibration) {
          // If roof is not open, there's no use starting observations.
          if (roofState !== "OPEN") {
            await delay(POLLING_INTERVAL);
            continue;
          }
          // Target the telescope
          const lha = getLHA(new Date(), config.longitude, task.ra);
          await this.mountControllerClient.sendGotoCommand(lha, task.dec);
        }

        // Execute the task.
        await executeObservation(task, this.mountControllerClient);
      }
    } catch (error) {
      // All errors propagated to this level are critical and will lead to process termination.
      logger.fatal("Fatal error in executor loop: %s", error);
      process.exit(1);
    }
  }

  private readScheduledTask(): ObservationScheduleItem | null {
    const now = Date.now();
    const [task] = db
      .select()
      .from(observationsSchedule)
      .where(
        and(
          gt(observationsSchedule.startDate, now), // time window start
          lte(observationsSchedule.endDate, now), // time window end
        ),
      )
      .all();
    return task;
  }
}

export default ScheduleExecutor;
