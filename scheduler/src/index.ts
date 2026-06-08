import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import logger from "./logger.ts";
import BackupSaver from "./backupSaver.ts";
import StatisticsSaver from "./statisticsSaver.ts";
import { createApiServer } from "./api/index.ts";

const motorController = new MotorController(config.serialPort, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);
const backupSaver = new BackupSaver();
const statisticsSaver = new StatisticsSaver(motorController);

const start = async () => {
  try {
    logger.info("Starting schedule executor");
    scheduleExecutor.run();
    backupSaver.run();
    statisticsSaver.run();

    logger.info("Initializing HTTP server on port %d", config.httpPort);
    const app = await createApiServer(motorController, statisticsSaver);
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
