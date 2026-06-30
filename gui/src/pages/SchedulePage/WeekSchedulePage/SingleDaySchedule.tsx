import BackgroundCells from "./BackgroundCells";
import ObservationTimeCell from "./ObservationTimeCell";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Schedule } from "../types";
import { dayLengthMs } from "@/calculations/getSunLevelsForDay";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

dayjs.extend(utc);

type SingleDayScheduleProps = {
  startOfDay: number;
  schedule: Schedule[];
  onSelectDay: (timestamp: number) => void;
};

/**
 * Displays a single day of observation schedule.
 *
 * The provided timestamp should be the start of the day in UTC, as a Unix timestamp in ms.
 *
 * Note that the used convention treats midnight UTC as start/end of day,
 * and the timeline spans hours from 0 to 24 hours. So, observations will be displayed
 * close to start of the day (after midnight) and close to end of the day (before midnight).
 */

function SingleDaySchedule({
  startOfDay,
  schedule,
  onSelectDay,
}: SingleDayScheduleProps) {
  const dateStr = dayjs.utc(startOfDay).format("YYYY-MM-DD (ddd)");
  const endOfDay = startOfDay + dayLengthMs;

  // Schedule is already sorted by start date
  const trimmedStart =
    schedule.length > 0 ? Math.max(schedule[0].startDate, startOfDay) : null;
  const trimmedEnd =
    schedule.length > 0
      ? Math.min(schedule[schedule.length - 1].endDate, endOfDay)
      : null;

  const normalizedStart =
    trimmedStart !== null ? (trimmedStart - startOfDay) / dayLengthMs : null;
  const normalizedEnd =
    trimmedEnd !== null ? (trimmedEnd - startOfDay) / dayLengthMs : null;

  const handleDayEditClick = useCallback(() => {
    onSelectDay?.(startOfDay);
  }, [onSelectDay, startOfDay]);

  return (
    <div className="flex flex-col grow">
      <div className="pl-5 flex justify-between items-center">
        {dateStr}
        <Button onClick={handleDayEditClick}>Edit</Button>
      </div>
      <div className="flex grow">
        {/* Hours column */}
        <div className="flex flex-col justify-between w-5 pr-1 text-right">
          <div>0</div>
          <div>12</div>
          <div>24</div>
        </div>

        {/* Time cells grid */}
        <div className="grow flex flex-col relative">
          <BackgroundCells startOfDay={startOfDay} />
          {normalizedStart && normalizedEnd ? (
            <ObservationTimeCell
              normalizedStart={normalizedStart}
              normalizedEnd={normalizedEnd}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SingleDaySchedule;
