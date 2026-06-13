import Fastify from "fastify";
import {
  handleGetSchedule,
  handleGetStatus,
  handleGetStatisticsHistory,
  handleScheduleObservation,
  handleUpdateObservation,
  handleDeleteObservation,
  handleGetStarCatalog,
  handleGetVarTypes,
} from "./apiHandlers.ts";
import type MountController from "../backgroundTasks/mountController/index.ts";
import type StatisticsSaver from "../backgroundTasks/statisticsSaver.ts";
import cors from "@fastify/cors";

export const createApiServer = async (
  mountControllerClient: MountController,
  statisticsSaver: StatisticsSaver,
) => {
  const app = Fastify({ logger: false });

  // this allows connections both from localhost and IP,
  // but for public sites it's not recommended
  await app.register(cors, {
    origin: "*",
  });

  app.get("/schedule", handleGetSchedule);
  app.post("/schedule", handleScheduleObservation);
  app.patch("/schedule/:id", handleUpdateObservation);
  app.delete("/schedule/:id", handleDeleteObservation);
  app.get("/current-status", () =>
    handleGetStatus(mountControllerClient, statisticsSaver),
  );
  app.get("/statistics", handleGetStatisticsHistory);
  app.get("/starCatalog", handleGetStarCatalog);
  app.get("/varTypes", handleGetVarTypes);

  return app;
};
