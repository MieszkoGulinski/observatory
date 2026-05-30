import logger from "./logger.ts";
import MotorController from "./motorController.js";
import { delay } from "./utils.ts";
import db from "./db/index.ts";
import { observationsSchedule } from "./db/schema.ts";
import { and, eq, gt, lte } from "drizzle-orm";
import executeObservation from "./executeObservation.ts";

const POLL_TIME_WINDOW = 60000; // 1 min
const POLLING_INTERVAL = 5000; // 5 s

class ScheduleExecutor {
  motorController: MotorController;

  constructor(motorController: MotorController) {
    this.motorController = motorController;
  }

  async run() {
    try {
      while (true) {
        // Logic:
        // 1. If the conditions are suitable to open the roof (weather sensors + time), and the roof is closed, send a command to open it
        // 2. If the conditions are suitable to close the roof (time), and the roof is open, send a command to close it.
        // Note that the microcontroller will auto-close the roof in case of detecting bad weather independently of commands from the scheduler.
        // The scheduler needs to check if the roof is open before starting observations.
        // Opening/closing the roof is not included in the tasks list.
        // 3. If there is a scheduled observation, and conditions allow, execute it.
        // 4. If there is an old pending task, meaning that it was scheduled for a time that has already passed but not executed,
        // execute it or not depending on task type.
        // Tasks may have statuses: upcoming, running, completed, skipped
        // 5. If there is no scheduled task, wait for a new one to be added. Poll the database every ~5 seconds.
        // 6. When time changes from night to day, create a database backup that can be copied along with raw files,
        // to prevent issues with database file being written to while being copied.

        // Note that it's scheduler's responsibility to insert new task after the last one should be completed. Otherwise, the
        // scheduler will skip over the scheduled task. This is intentional so that we skip observations when the conditions
        // are not met

        // Initial wait for MCU status data
        if (this.motorController.lastSensorState === null) {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // If it's time to open the roof, send command to open the roof.
        // If it's time to close the roof, send command to close the roof.
        // TODO add time conditions
        // TODO add timeouts using Promise.race so that we can handle potential hangs
        const { roofState } = this.motorController.lastSensorState;
        if (roofState === "CLOSED") {
          await this.motorController.sendCommand("OPEN");
          continue;
        }
        if (roofState === "OPEN") {
          await this.motorController.sendCommand("CLOSE");
          continue;
        }

        // Poll for new scheduled observation.
        // Polling, even if less efficient than event-based notification,
        // is simpler to implement and easier to understand (less risk of bugs).
        const now = Date.now();
        const [task] = db
          .select()
          .from(observationsSchedule)
          .where(
            and(
              eq(observationsSchedule.status, 0), // scheduled
              gt(observationsSchedule.startDate, now), // time window start
              lte(observationsSchedule.endDate, now + POLL_TIME_WINDOW), // time window end
            ),
          )
          .all();

        if (!task) {
          await delay(POLLING_INTERVAL);
          continue;
        }

        // Execute the task.
        await executeObservation(task.id);
      }
    } catch (error) {
      // All errors propagated to this level are critical and will lead to process termination.
      logger.fatal("Fatal error in executor loop: %s", error);
      process.exit(1);
    }
  }
}

export default ScheduleExecutor;
