import { useState } from "react";
import WeekSchedulePage from "./WeekSchedulePage";
import DaySchedulePage from "./DaySchedulePage";

function SchedulePage() {
  const [displayedDayStart, setDisplayedDayStart] = useState<number | null>(
    null,
  );

  if (displayedDayStart) {
    return <DaySchedulePage startOfDay={displayedDayStart} />;
  }
  return <WeekSchedulePage onSelectDay={setDisplayedDayStart} />;
}

export default SchedulePage;
