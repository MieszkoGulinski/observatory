import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export type NightStatus = "Upcoming" | "Active" | "Past";

function getNightStartEndStatus(
  dayStr: string,
  timeZone: string,
  now?: Date,
): [number, number, NightStatus] {
  // there was no other way to properly handle daylight saving time transition
  const start = dayjs.tz(dayStr + "T12:00:00", timeZone);
  const end = dayjs.tz(
    start.add(1, "day").format("YYYY-MM-DD") + "T12:00:00",
    timeZone,
  );

  const startTimestamp = start.valueOf();
  const endTimestamp = end.valueOf();

  if (!now) {
    now = new Date();
  }

  let status: NightStatus;
  if (now.valueOf() < startTimestamp) {
    status = "Upcoming";
  } else if (now.valueOf() > endTimestamp) {
    status = "Past";
  } else {
    status = "Active";
  }

  return [startTimestamp, endTimestamp, status] as const;
}

export default getNightStartEndStatus;

export const cssClassByStatus: Record<NightStatus, string> = {
  Upcoming: "",
  Active: "font-semibold",
  Past: "text-gray-500",
};
