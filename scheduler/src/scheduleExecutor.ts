import logger from "./logger.ts";
import MotorController from "./motorController.js";
import { delay } from "./utils.ts";

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
        // 3. If there is a scheduled task e.g. observation, and conditions allow, execute it.
        // 4. If there is an old pending task, meaning that it was scheduled for a time that has already passed but not executed,
        // execute it or not depending on task type.
        // Tasks may have statuses: upcoming, running, completed, skipped
        // 5. If there is no scheduled task, wait for a new one to be added. Poll the database every ~5 seconds.
        // Polling, even if less efficient than event-based notification, is simpler to implement and easier to understand (less risk of bugs).

        await delay(1000);
      }
    } catch (error) {
      // All errors propagated to this level are critical and will lead to process termination.
      logger.fatal("Fatal error in executor loop: %s", error);
      process.exit(1);
    }
  }
}

export default ScheduleExecutor;
