import { useState } from "react";
import WeekSchedulePage from "./WeekSchedulePage";
import DaySchedulePage from "./DaySchedulePage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function SchedulePage() {
  const [displayedDayStart, setDisplayedDayStart] = useState<number | null>(
    null,
  );
  const [weekStartTime, setWeekStartTime] = useState<number>(() =>
    dayjs().utc().startOf("day").valueOf(),
  );

  if (displayedDayStart) {
    return (
      <DaySchedulePage
        startOfDay={displayedDayStart}
        backToWeekSchedule={() => setDisplayedDayStart(null)}
      />
    );
  }
  return (
    <WeekSchedulePage
      onSelectDay={setDisplayedDayStart}
      weekStartTime={weekStartTime}
      setWeekStartTime={setWeekStartTime}
    />
  );
}

export default SchedulePage;
