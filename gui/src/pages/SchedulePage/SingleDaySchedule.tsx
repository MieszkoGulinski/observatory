import BackgroundCells from "./BackgroundCells";
import ObservationCell, { type ObservationCellProps } from "./ObservationCell";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Schedule } from "./types";
import { dayLengthMs } from "@/calculations/getSunLevelsForDay";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ObservationModal from "./ObservationModal";

dayjs.extend(utc);

type SingleDayScheduleProps = {
  startOfDay: number;
  schedule: Schedule[];
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

function SingleDaySchedule({ startOfDay, schedule }: SingleDayScheduleProps) {
  const [addingNewObservation, setAddingNewObservation] = useState(false);
  const [editedObservationId, setEditedObservationId] = useState<number | null>(
    null,
  );

  const dateStr = dayjs.utc(startOfDay).format("YYYY-MM-DD (ddd)");
  const endOfDay = startOfDay + dayLengthMs;

  const formattedSchedule: ObservationCellProps[] = schedule.map((s) => {
    const trimmedStart = Math.max(s.startDate, startOfDay);
    const trimmedEnd = Math.min(s.endDate, endOfDay);

    const normalizedStart = (trimmedStart - startOfDay) / dayLengthMs;
    const normalizedEnd = (trimmedEnd - startOfDay) / dayLengthMs;

    return {
      id: s.id,
      label: s.note ?? "",
      startPerc: normalizedStart * 100,
      endPerc: normalizedEnd * 100,
      onClick: () => setEditedObservationId(s.id),
    };
  });

  const handleNewObservationClick = () => {
    setAddingNewObservation(true);
  };

  return (
    <div className="flex flex-col grow">
      <div className="pl-5 flex justify-between items-center">
        {dateStr}
        <Button onClick={handleNewObservationClick}>Add</Button>
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
          {formattedSchedule.map((s) => (
            <ObservationCell {...s} key={s.id} />
          ))}
          {/* TODO remove after implementing full scheduling functionality */}
          <ObservationCell
            label="RR Lyrae"
            startPerc={35}
            endPerc={50}
            id={-1}
            onClick={() => {}}
          />
          <ObservationCell
            label="Mu Cephei"
            startPerc={50}
            endPerc={52}
            id={-2}
            onClick={() => {}}
          />
          <ObservationCell
            label="P Cygni"
            startPerc={52}
            endPerc={54}
            id={-3}
            onClick={() => {}}
          />
          <ObservationCell
            label="Rho Cassiopeae"
            startPerc={54}
            endPerc={56}
            id={-4}
            onClick={() => {}}
          />
          <ObservationCell
            label="Zeta Geminorum"
            startPerc={56}
            endPerc={66}
            id={-5}
            onClick={() => {}}
          />
        </div>
      </div>
      {addingNewObservation ? (
        <ObservationModal onClose={() => setAddingNewObservation(false)} />
      ) : null}
      {editedObservationId ? (
        <ObservationModal
          scheduleItem={schedule.find((s) => s.id === editedObservationId)}
          onClose={() => setEditedObservationId(null)}
        />
      ) : null}
    </div>
  );
}

export default SingleDaySchedule;
