import { Calendar } from "@/components/ui/calendar";
import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { type StatisticsRow } from "./types";
import StatisticsChart from "./StatisticsChart";

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
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <StatisticsChart
            data={data}
            dataKey="cameraTemperature"
            label="Camera temperature"
            color="#ff0000"
          />
          <StatisticsChart
            data={data}
            dataKey="airTemperature"
            label="Air temperature"
            color="#ff7300"
          />
          <StatisticsChart
            data={data}
            dataKey="humidity"
            label="Humidity"
            color="#387908"
          />
          <StatisticsChart
            data={data}
            dataKey="batteryVoltage"
            label="Battery voltage"
            color="#8884d8"
          />
          <StatisticsChart
            data={data}
            dataKey="uptime"
            label="Uptime"
            color="#0088fe"
          />
          <StatisticsChart
            data={data}
            dataKey="freeMemory"
            label="Free memory"
            color="#00c49f"
          />
          <StatisticsChart
            data={data}
            dataKey="totalMemory"
            label="Total memory"
            color="#ffbb28"
          />
          <StatisticsChart
            data={data}
            dataKey="load1"
            label="Load 1"
            color="#ff8042"
          />
          <StatisticsChart
            data={data}
            dataKey="load5"
            label="Load 5"
            color="#a4de6c"
          />
          <StatisticsChart
            data={data}
            dataKey="load15"
            label="Load 15"
            color="#d0ed57"
          />
        </div>
      ) : null}
    </>
  );
}

export default StatisticsHistoryPage;
