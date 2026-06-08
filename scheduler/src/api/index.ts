import Fastify from "fastify";
import {
  handleGetObservationTimes,
  handleGetSchedule,
  handleGetStatus,
  handleGetStatisticsHistory,
  handleScheduleObservation,
  handleUpdateObservation,
  handleDeleteObservation,
} from "./apiHandlers.ts";
import type MotorController from "../motorController.ts";
import type StatisticsSaver from "../statisticsSaver.ts";
import cors from "@fastify/cors";

export const createApiServer = async (
  motorController: MotorController,
  statisticsSaver: StatisticsSaver,
) => {
  const app = Fastify({ logger: false });

  // this allows connections both from localhost and IP,
  // but for public sites it's not recommended
  await app.register(cors, {
    origin: "*",
  });

  app.get("/observation-times", handleGetObservationTimes);
  app.get("/schedule", handleGetSchedule);
  app.post("/schedule", handleScheduleObservation);
  app.patch("/schedule/:id", handleUpdateObservation);
  app.delete("/schedule/:id", handleDeleteObservation);
  app.get("/current-status", () =>
    handleGetStatus(motorController, statisticsSaver),
  );
  app.get("/statistics", handleGetStatisticsHistory);

  return app;
};
