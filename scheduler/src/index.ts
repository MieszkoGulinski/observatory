import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import Fastify from "fastify";
import logger from "./logger.ts";

const motorController = new MotorController(config.serialPort, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);

scheduleExecutor.run(); // returns a promise but we don't need to await it, it's a never-ending loop unless an error occurs

const app = Fastify({ logger: false });

const start = async () => {
  try {
    await app.listen({
      port: config.httpPort,
    });
  } catch (err) {
    logger.fatal(err, "Unable to start the server");
    process.exit(1);
  }
};

start();
