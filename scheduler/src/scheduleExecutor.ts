import logger from "./logger.ts";
import MotorController from "./motorController.js";
import { delay } from "./utils.ts";
import db from "./db/index.ts";
import { observationsSchedule } from "./db/schema.ts";
import { and, gt, lte } from "drizzle-orm";
import executeObservation from "./executeObservation.ts";
import { isDayNight } from "./calculateDayNight.ts";

const POLLING_INTERVAL = 5000; // 5 s

class ScheduleExecutor {
  motorController: MotorController;

  constructor(motorController: MotorController) {
    this.motorController = motorController;
  }

  async run() {
    try {
      while (true) {
        // Initial wait for MCU status data
        if (this.motorController.lastSensorState === null) {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // If it's time to open the roof, send command to open the roof.
        // If it's time to close the roof, send command to close the roof.
        // Note that if the microcontroller detects unsuitable conditions, it will close the roof independently of these commands.
        // TODO add timeouts using Promise.race so that we can handle potential hangs

        const { isDay, isNight } = isDayNight();
        const { roofState, conditionsSuitableForObservation: openingAllowed } =
          this.motorController.lastSensorState;
        if (roofState === "CLOSED" && openingAllowed && isNight) {
          logger.info("Submitting command to open roof");
          this.motorController.sendOpenCommand();
          await delay(POLLING_INTERVAL);
          continue;
        }
        if ((roofState === "OPEN" || roofState === "OPENING") && isDay) {
          logger.info("Submitting command to close roof");
          this.motorController.sendCloseCommand();
          await delay(POLLING_INTERVAL);
          continue;
        }

        // If roof is not open, wait until it is open, there's no use starting observations.
        if (roofState !== "OPEN") {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // Poll for new scheduled observation.
        // Polling, even if less efficient than event-based notification,
        // is simpler to implement and easier to understand (less risk of bugs).
        // The code detects if an observation needs to be started, and if so, executes it.
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

        if (!task) {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // Execute the task.
        await executeObservation(task, this.motorController);
      }
    } catch (error) {
      // All errors propagated to this level are critical and will lead to process termination.
      logger.fatal("Fatal error in executor loop: %s", error);
      process.exit(1);
    }
  }
}

export default ScheduleExecutor;
