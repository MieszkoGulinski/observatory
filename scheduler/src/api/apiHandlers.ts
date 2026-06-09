import { type FastifyRequest, type FastifyReply } from "fastify";
import { getObservationTimesForUpcomingDays } from "../calculateDayNight.ts";
import db from "../db/index.ts";
import { observationsSchedule, statistics } from "../db/schema.ts";
import { and, gte, lte } from "drizzle-orm";
import type StatisticsSaver from "../statisticsSaver.ts";
import type MountController from "../mountController.ts";

// This file contains handler functions for the REST API with parsing of arguments.

// List observation times
export function handleGetObservationTimes(request: FastifyRequest) {
  const { numberOfDays, offsetDays } = request.query as {
    numberOfDays?: string;
    offsetDays?: string;
  };

  return getObservationTimesForUpcomingDays(
    numberOfDays ? parseInt(numberOfDays, 10) : undefined,
    offsetDays ? parseInt(offsetDays, 10) : undefined,
  );
}

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
  return db
    .select()
    .from(observationsSchedule)
    .where(
      and(
        lte(observationsSchedule.startDate, endDate),
        gte(observationsSchedule.startDate, startDate),
      ),
    );
}

// Schedule a new observation.
export async function handleScheduleObservation(request: FastifyRequest) {
  // TODO complete
  return {};
}

// Update an observation in the schedule.
export async function handleUpdateObservation(request: FastifyRequest) {
  // TODO complete
  return {};
}

// Delete an observation from the schedule.
export async function handleDeleteObservation(request: FastifyRequest) {
  // TODO complete
  return {};
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
