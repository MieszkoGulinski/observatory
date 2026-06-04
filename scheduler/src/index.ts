import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import logger from "./logger.ts";
import { setupTables } from "./db/index.ts";
import BackupController from "./backupController.ts";
import OSLoadControler from "./osLoadController.ts";
import { createApiServer } from "./api/index.ts";

const motorController = new MotorController(config.serialPort, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);
const backupController = new BackupController();
const osLoadController = new OSLoadControler();

const start = async () => {
  try {
    logger.info("Setting up database tables");
    setupTables();

    logger.info("Starting schedule executor");
    scheduleExecutor.run();
    backupController.run();
    osLoadController.run();

    logger.info("Initializing HTTP server on port %d", config.httpPort);
    const app = await createApiServer(motorController, osLoadController);
    await app.listen({
      port: config.httpPort,
    });
    logger.info("Scheduler started successfully");
  } catch (err) {
    logger.fatal(err, "Unable to start the scheduler");
    process.exit(1);
  }
};

start();
