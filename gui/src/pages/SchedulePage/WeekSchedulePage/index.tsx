import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { type Dispatch, type SetStateAction } from "react";
import useSWR from "swr";
import type { ScheduleWithTargetStar } from "../types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SingleDaySchedule from "./SingleDaySchedule";
import utc from "dayjs/plugin/utc";
import { dayLengthMs } from "@/calculations/getSunLevelsForDay";
import ApiErrorMessage from "@/components/ApiErrorMessage";

dayjs.extend(utc);

const DISPLAYED_DAYS = 7;

type WeekSchedulePageProps = {
  onSelectDay: (day: number) => void;
  weekStartTime: number;
  setWeekStartTime: Dispatch<SetStateAction<number>>;
};

function WeekSchedulePage({
  onSelectDay,
  weekStartTime,
  setWeekStartTime,
}: WeekSchedulePageProps) {
  const weekEndTime = weekStartTime + DISPLAYED_DAYS * dayLengthMs;

  const daysStartsMs = Array.from({ length: DISPLAYED_DAYS }).map((_, i) => {
    return weekStartTime + i * dayLengthMs;
  });

  const { data: schedule, error } = useSWR<ScheduleWithTargetStar[]>(
    `/schedule?start=${weekStartTime}&end=${weekEndTime}`,
    fetcher,
  );

  const onClickPrev = () => {
    setWeekStartTime((prev) => dayjs(prev).subtract(1, "d").valueOf());
  };
  const onClickNext = () => {
    setWeekStartTime((prev) => dayjs(prev).add(1, "d").valueOf());
  };

  if (error) return <ApiErrorMessage error={error} />;

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button onClick={onClickPrev}>Prev</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button>{dayjs(weekStartTime).format("YYYY-MM-DD")}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={new Date(weekStartTime)}
              onSelect={(d) => {
                if (!d) return;
                setWeekStartTime(d.valueOf());
              }}
              className="rounded-lg border"
            />
          </PopoverContent>
        </Popover>
        <Button onClick={onClickNext}>Next</Button>
      </div>
      <div className="flex gap-2 h-[calc(100vh-120px)] min-h-[720px] overflow-x-auto">
        {daysStartsMs.map((startOfDay) => (
          <SingleDaySchedule
            key={startOfDay}
            startOfDay={startOfDay}
            schedule={(schedule || []).filter(
              (s) =>
                s.startDate <= startOfDay + dayLengthMs &&
                s.endDate >= startOfDay,
            )}
            onSelectDay={onSelectDay}
          />
        ))}
      </div>
    </>
  );
}

export default WeekSchedulePage;
