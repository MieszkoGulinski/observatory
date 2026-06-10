import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import type { Schedule } from "./types";
import { Calendar } from "@/components/ui/calendar";

function SchedulePage() {
  const [searchStartTime, setSearchStartTime] = useState<number>(() =>
    dayjs().startOf("day").valueOf(),
  );
  const searchEndTime = dayjs(searchStartTime).add(1, "d").valueOf();

  const {
    data: dataFromServer,
    error,
    isLoading,
  } = useSWR<Schedule[]>(
    `/schedule?start=${searchStartTime}&end=${searchEndTime}`,
    fetcher,
  );

  return (
    <>
      <Calendar
        mode="single"
        selected={new Date(searchStartTime)}
        onSelect={(d) => {
          if (!d) return;
          setSearchStartTime(d.valueOf());
        }}
        className="rounded-lg border"
      />
      {isLoading ? <>loading...</> : null}
      {error ? <>error</> : null}
    </>
  );
}

export default SchedulePage;
