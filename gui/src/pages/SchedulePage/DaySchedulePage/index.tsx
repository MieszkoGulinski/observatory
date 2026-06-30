import { dayLengthMs } from "@/calculations/getSunLevelsForDay";
import { fetcher } from "@/utils";
import useSWR from "swr";
import type { ScheduleWithTargetStar } from "../types";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import SpinnerLine from "@/components/SpinnerLine";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DayScheduleTable from "./DayScheduleTable";

dayjs.extend(utc);

type DaySchedulePageProps = {
  startOfDay: number;
  backToWeekSchedule: () => void;
};

function DaySchedulePage({
  startOfDay,
  backToWeekSchedule,
}: DaySchedulePageProps) {
  const endOfDay = startOfDay + dayLengthMs;

  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<ScheduleWithTargetStar[]>(
    `/schedule?start=${startOfDay}&end=${endOfDay}`,
    fetcher,
  );

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <Button onClick={backToWeekSchedule}>Back</Button>
        {dayjs(startOfDay).format("YYYY-MM-DD (ddd)")}
      </div>
      {error ? <ApiErrorMessage error={error} /> : null}
      {isLoading || !schedule ? (
        <SpinnerLine />
      ) : (
        <DayScheduleTable schedule={schedule} />
      )}
    </div>
  );
}

export default DaySchedulePage;
