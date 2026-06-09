import MountController from "./mountController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import logger from "./logger.ts";
import BackupSaver from "./backupSaver.ts";
import StatisticsSaver from "./statisticsSaver.ts";
import { createApiServer } from "./api/index.ts";
import SerialPortMountController from "./serialPortMountController.ts";

const serialPortMountController = new SerialPortMountController(
  config.serialPort,
  config.baudRate,
);
const mountControllerClient = new MountController(serialPortMountController);
const scheduleExecutor = new ScheduleExecutor(mountControllerClient);
const backupSaver = new BackupSaver();
const statisticsSaver = new StatisticsSaver(mountControllerClient);

const start = async () => {
  try {
    logger.info("Starting schedule executor");
    scheduleExecutor.run();
    backupSaver.run();
    statisticsSaver.run();

    logger.info("Initializing HTTP server on port %d", config.httpPort);
    const app = await createApiServer(mountControllerClient, statisticsSaver);
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
