import { describe, it, expect } from "vitest";
import getNightStartEndStatus from "./getNightStartEndStatus";

describe("getNightStartEndStatus", () => {
  it("calculates start and end timestamps correctly in UTC", () => {
    // 2024-03-01 in UTC
    const [start, end] = getNightStartEndStatus("2024-03-01", "UTC");

    expect(new Date(start).toISOString()).toBe("2024-03-01T12:00:00.000Z");
    expect(new Date(end).toISOString()).toBe("2024-03-02T12:00:00.000Z");
  });

  it("calculates start and end timestamps correctly in Europe/Warsaw timezone, winter time", () => {
    const [start, end] = getNightStartEndStatus("2024-03-01", "Europe/Warsaw");

    // UTC+1 in winter
    expect(new Date(start).toISOString()).toBe("2024-03-01T11:00:00.000Z");
    expect(new Date(end).toISOString()).toBe("2024-03-02T11:00:00.000Z");
  });

  it("calculates start and end timestamps correctly in Europe/Warsaw timezone, summer time", () => {
    const [start, end] = getNightStartEndStatus("2024-07-01", "Europe/Warsaw");

    // UTC+2 in summer
    expect(new Date(start).toISOString()).toBe("2024-07-01T10:00:00.000Z");
    expect(new Date(end).toISOString()).toBe("2024-07-02T10:00:00.000Z");
  });

  it("returns 'Upcoming' when now is before startTimestamp", () => {
    const now = new Date("2024-03-01T10:00:00.000Z");
    const [, , status] = getNightStartEndStatus("2024-03-01", "UTC", now);
    expect(status).toBe("Upcoming");
  });

  it("returns 'Active' when now is between startTimestamp and endTimestamp", () => {
    const now = new Date("2024-03-01T15:00:00.000Z");
    const [, , status] = getNightStartEndStatus("2024-03-01", "UTC", now);
    expect(status).toBe("Active");
  });

  it("returns 'Past' when now is after endTimestamp", () => {
    const now = new Date("2024-03-02T15:00:00.000Z");
    const [, , status] = getNightStartEndStatus("2024-03-01", "UTC", now);
    expect(status).toBe("Past");
  });

  it("correctly handles DST transition", () => {
    // 2026-10-24 Saturday, daylight saving time transition on 25th
    const [start, end] = getNightStartEndStatus("2026-10-24", "Europe/Warsaw");
    expect(new Date(start).toISOString()).toBe("2026-10-24T10:00:00.000Z"); // UTC+2
    expect(new Date(end).toISOString()).toBe("2026-10-25T11:00:00.000Z"); // UTC+1
  });

  it("correctly handles New Years night", () => {
    const [start, end] = getNightStartEndStatus("2026-12-31", "Europe/Warsaw");
    expect(new Date(start).toISOString()).toBe("2026-12-31T11:00:00.000Z"); // UTC+1
    expect(new Date(end).toISOString()).toBe("2027-01-01T11:00:00.000Z"); // UTC+1
  });

  it("calculates start and end timestamps correctly in America/Anchorage timezone (large negative UTC offset)", () => {
    const [start, end] = getNightStartEndStatus(
      "2026-12-31",
      "America/Anchorage",
    );
    expect(new Date(start).toISOString()).toBe("2026-12-31T21:00:00.000Z"); // UTC-9
    expect(new Date(end).toISOString()).toBe("2027-01-01T21:00:00.000Z"); // UTC-9
  });
});
