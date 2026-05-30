import MotorController from "./motorController.ts";

class ScheduleExecutor {
  motorController: MotorController;

  constructor(motorController: MotorController) {
    this.motorController = motorController;
  }

  async run() {
    // ..
  }
}

export default ScheduleExecutor;
