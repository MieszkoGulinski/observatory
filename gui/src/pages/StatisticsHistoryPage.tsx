import { Calendar } from "@/components/ui/calendar";
import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";

// TODO share the same types in scheduler and React frontend (both use TypeScript)
type StatisticsRow = {
  id: number;
  timestamp: number;

  // Sensor values
  cameraTemperature: number;
  airTemperature: number;
  humidity: number;
  batteryVoltage: number;

  // OS statistics
  uptime: number;
  freeMemory: number;
  totalMemory: number;
  load1: number;
  load5: number;
  load15: number;
};

function StatisticsHistoryPage() {
  const [searchStartTime, setSearchStartTime] = useState<number>(() =>
    dayjs().startOf("day").valueOf(),
  );
  const searchEndTime = dayjs(searchStartTime).add(1, "d").valueOf();
  const { data, error, isLoading } = useSWR<StatisticsRow[]>(
    `/statistics?start=${searchStartTime}&end=${searchEndTime}`,
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
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
    </>
  );
}

export default StatisticsHistoryPage;
