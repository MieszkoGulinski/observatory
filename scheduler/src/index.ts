import MotorController from "./motorController.ts";
import ScheduleExecutor from "./scheduleExecutor.ts";
import config from "./config.ts";
import Fastify from "fastify";
import logger from "./logger.ts";
import { setupTables } from "./db/index.ts";
import BackupController from "./backupController.ts";
import {
  handleDeleteObservation,
  handleGetObservationTimes,
  handleGetSchedule,
  handleScheduleObservation,
  handleUpdateObservation,
  handleGetStatus,
} from "./apiHandlers.ts";
import OSLoadControler from "./osLoadController.ts";

const motorController = new MotorController(config.serialPort, config.baudRate);
const scheduleExecutor = new ScheduleExecutor(motorController);
const backupController = new BackupController();
const osLoadController = new OSLoadControler();

const app = Fastify({ logger: false });

app.get("/observation-times", handleGetObservationTimes);
app.get("/schedule", handleGetSchedule);
app.post("/schedule", handleScheduleObservation);
app.patch("/schedule/:id", handleUpdateObservation);
app.delete("/schedule/:id", handleDeleteObservation);
app.get("/status", () =>
  handleGetStatus(motorController, osLoadController),
);

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
    backupController.run();
    osLoadController.run();
  } catch (err) {
    logger.fatal(err, "Unable to start the server");
    process.exit(1);
  }
};

start();
