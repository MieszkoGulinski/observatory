import { type FastifyRequest, type FastifyReply } from "fastify";
import db from "../db/index.ts";
import {
  insertObservationSchema,
  observationsSchedule,
  statistics,
  updateObservationSchema,
  starCatalog,
} from "../db/schema.ts";
import { and, gte, lte, eq, isNotNull } from "drizzle-orm";
import type StatisticsSaver from "../backgroundTasks/statisticsSaver.ts";
import type MountController from "../backgroundTasks/mountController/index.ts";

// This file contains handler functions for the REST API with parsing of arguments.

// List planned observations in the given time range
export function handleGetSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { start, end } = request.query as {
    start: string;
    end: string;
  };
  if (!start || !end) {
    return reply.status(400).send({ error: "Missing start or end time" });
  }
  const startDate = parseInt(start, 10);
  const endDate = parseInt(end, 10);
  if (isNaN(startDate) || isNaN(endDate)) {
    return reply.status(400).send({ error: "Invalid start or end time" });
  }
  const scheduleRows = db
    .select()
    .from(observationsSchedule)
    .leftJoin(
      starCatalog,
      eq(observationsSchedule.targetStarId, starCatalog.id),
    )
    .where(
      and(
        lte(observationsSchedule.startDate, endDate),
        gte(observationsSchedule.startDate, startDate),
      ),
    )
    .all();

  return scheduleRows.map((row) => ({
    ...row.observations_schedule,
    targetStar: row.star_catalog,
  }));
}

// Schedule a new observation.
export async function handleScheduleObservation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = insertObservationSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply
      .status(400)
      .send({ error: "Invalid input", details: parsed.error.issues });
  }

  const result = db
    .insert(observationsSchedule)
    .values(parsed.data)
    .returning()
    .all();

  return result[0];
}

// Update an observation in the schedule.
export async function handleUpdateObservation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const observationId = parseInt(id, 10);
  if (isNaN(observationId)) {
    return reply.status(400).send({ error: "Invalid observation ID" });
  }

  const parsed = updateObservationSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply
      .status(400)
      .send({ error: "Invalid input", details: parsed.error.issues });
  }

  const existing = db
    .select()
    .from(observationsSchedule)
    .where(eq(observationsSchedule.id, observationId))
    .get();

  if (!existing) {
    return reply.status(404).send({ error: "Observation not found" });
  }

  if (existing.startDate < Date.now()) {
    return reply.status(400).send({
      error:
        "Cannot update an observation that has already started or is in the past",
    });
  }

  db.update(observationsSchedule)
    .set(parsed.data)
    .where(eq(observationsSchedule.id, observationId))
    .run();

  return { success: true };
}

// Delete an observation from the schedule.
export async function handleDeleteObservation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const observationId = parseInt(id, 10);
  if (isNaN(observationId)) {
    return reply.status(400).send({ error: "Invalid observation ID" });
  }

  const existing = db
    .select()
    .from(observationsSchedule)
    .where(eq(observationsSchedule.id, observationId))
    .get();

  if (!existing) {
    return reply.status(404).send({ error: "Observation not found" });
  }

  if (existing.startDate < Date.now()) {
    return reply.status(400).send({
      error:
        "Cannot delete an observation that has already started or is in the past",
    });
  }

  db.delete(observationsSchedule)
    .where(eq(observationsSchedule.id, observationId))
    .execute();

  return { success: true };
}

// Includes current time in UNIX timestamp in ms - may be necessary for the GUI
// to avoid clock drift
export async function handleGetStatus(
  mountControllerClient: MountController,
  statisticsSaver: StatisticsSaver,
) {
  return {
    time: Date.now(),
    osStats: statisticsSaver.getOSStats(),
    controllerState: mountControllerClient.lastSensorState,
  };
}

export async function handleGetStatisticsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { start, end } = request.query as {
    start: string;
    end: string;
  };
  if (!start || !end) {
    return reply.status(400).send({ error: "Missing start or end time" });
  }
  const startDate = parseInt(start, 10);
  const endDate = parseInt(end, 10);
  if (isNaN(startDate) || isNaN(endDate)) {
    return reply.status(400).send({ error: "Invalid start or end time" });
  }
  return db
    .select()
    .from(statistics)
    .where(
      and(
        lte(statistics.timestamp, endDate),
        gte(statistics.timestamp, startDate),
      ),
    )
    .all();
}

export async function handleGetStarCatalog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { normalizedVarType } = request.query as {
    normalizedVarType?: string;
  };

  if (normalizedVarType) {
    return db
      .select()
      .from(starCatalog)
      .where(eq(starCatalog.normalizedVarType, normalizedVarType))
      .orderBy(starCatalog.ra)
      .all();
  }

  return db.select().from(starCatalog).orderBy(starCatalog.ra).all();
}

export async function handleGetVarTypes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = db
    .select({ normalizedVarType: starCatalog.normalizedVarType })
    .from(starCatalog)
    .where(isNotNull(starCatalog.normalizedVarType))
    .groupBy(starCatalog.normalizedVarType)
    .all();

  return result.map((r) => r.normalizedVarType);
}
