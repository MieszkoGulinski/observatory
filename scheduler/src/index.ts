import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import Fastify from "fastify";
import logger from "./logger.ts";
import { setupTables } from "./db/index.ts";

const motorController = new MotorController(config.serialPort, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);

const app = Fastify({ logger: false });

const start = async () => {
  try {
    logger.info("Initializing HTTP server on port %d", config.httpPort);
    await app.listen({
      port: config.httpPort,
    });

    logger.info("Setting up database tables");
    setupTables();

    logger.info("Starting schedule executor");
    scheduleExecutor.run();
  } catch (err) {
    logger.fatal(err, "Unable to start the server");
    process.exit(1);
  }
};

start();
