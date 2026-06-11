import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import type { Schedule } from "./types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SingleDaySchedule from "./SingleDaySchedule";

function SchedulePage() {
  const [searchStartTime, setSearchStartTime] = useState<number>(() =>
    dayjs().startOf("day").valueOf(),
  );
  const searchEndTime = dayjs(searchStartTime).add(1, "d").valueOf();

  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<Schedule[]>(
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
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
        <SingleDaySchedule date={new Date(searchStartTime)} />
      </div>
    </>
  );
}

export default SchedulePage;
