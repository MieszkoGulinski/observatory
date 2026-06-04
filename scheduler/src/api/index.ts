import Fastify from "fastify";
import {
  handleGetObservationTimes,
  handleGetSchedule,
  handleGetStatus,
  handleGetOsLoad,
  handleScheduleObservation,
  handleUpdateObservation,
  handleDeleteObservation,
} from "./apiHandlers.ts";
import type MotorController from "../motorController.ts";
import type OSLoadControler from "../osLoadController.ts";
import cors from "@fastify/cors";

export const createApiServer = async (
  motorController: MotorController,
  osLoadController: OSLoadControler,
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
  app.get("/status", () => handleGetStatus(motorController, osLoadController));
  app.get("/os-load", handleGetOsLoad);

  return app;
};
