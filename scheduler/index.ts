import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";

const motorController = new MotorController(config.port, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);
