import { dayLengthMs } from "@/calculations/getSunLevelsForDay";
import { fetcher } from "@/utils";
import useSWR from "swr";
import type { ScheduleWithTargetStar } from "../types";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import SpinnerLine from "@/components/SpinnerLine";

type DaySchedulePageProps = {
  startOfDay: number;
};

function DaySchedulePage({ startOfDay }: DaySchedulePageProps) {
  const endOfDay = startOfDay + dayLengthMs;

  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<ScheduleWithTargetStar[]>(
    `/schedule?start=${startOfDay}&end=${endOfDay}`,
    fetcher,
  );

  if (error) return <ApiErrorMessage error={error} />;
  if (isLoading || !schedule) return <SpinnerLine />;

  return <div>aaaa</div>;
}

export default DaySchedulePage;
