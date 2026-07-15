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
  const startTimestamp = dayjs(dayStr)
    .tz(timeZone)
    .startOf("day")
    .add(12, "hour")
    .valueOf();

  const endTimestamp = dayjs(startTimestamp)
    .tz(timeZone)
    .add(1, "day")
    .valueOf();

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
