import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import type { ScheduleWithTargetStar } from "./types";
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

dayjs.extend(utc);

const DISPLAYED_DAYS = 7;

function SchedulePage() {
  const [searchStartTime, setSearchStartTime] = useState<number>(() =>
    dayjs().utc().startOf("day").valueOf(),
  );
  const searchEndTime = searchStartTime + DISPLAYED_DAYS * dayLengthMs;

  const daysStartsMs = Array.from({ length: DISPLAYED_DAYS }).map((_, i) => {
    return searchStartTime + i * dayLengthMs;
  });

  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<ScheduleWithTargetStar[]>(
    `/schedule?start=${searchStartTime}&end=${searchEndTime}`,
    fetcher,
  );

  const onClickPrev = () => {
    setSearchStartTime((prev) => dayjs(prev).subtract(1, "d").valueOf());
  };
  const onClickNext = () => {
    setSearchStartTime((prev) => dayjs(prev).add(1, "d").valueOf());
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={onClickPrev}>Prev</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button>{dayjs(searchStartTime).format("YYYY-MM-DD")}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={new Date(searchStartTime)}
              onSelect={(d) => {
                if (!d) return;
                setSearchStartTime(d.valueOf());
              }}
              className="rounded-lg border"
            />
          </PopoverContent>
        </Popover>
        <Button onClick={onClickNext}>Next</Button>
        {schedule ? <div>{schedule.length} in displayed range</div> : null}
      </div>
      {isLoading ? <>loading...</> : null}
      {error ? <>error</> : null}
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
          />
        ))}
      </div>
    </>
  );
}

export default SchedulePage;
