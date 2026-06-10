import { Calendar } from "@/components/ui/calendar";
import { fetcher } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { type StatisticsRowFromServer } from "./types";
import StatisticsChart from "./StatisticsChart";

function StatisticsHistoryPage() {
  const [searchStartTime, setSearchStartTime] = useState<number>(() =>
    dayjs().startOf("day").valueOf(),
  );
  const searchEndTime = dayjs(searchStartTime).add(1, "d").valueOf();
  const {
    data: dataFromServer,
    error,
    isLoading,
  } = useSWR<StatisticsRowFromServer[]>(
    `/statistics?start=${searchStartTime}&end=${searchEndTime}`,
    fetcher,
  );

  const data = dataFromServer
    ? dataFromServer.map((row) => ({
        ...row,
        usedRAMPercent:
          (100 * (row.totalMemory - row.freeMemory)) / row.totalMemory,
      }))
    : null;

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
            dataKey="usedRAMPercent"
            label="Used RAM"
            color="#00c49f"
          />
          <StatisticsChart
            data={data}
            dataKey="load15"
            label="Load avg in 15 min"
            color="#d0ed57"
          />
        </div>
      ) : null}
    </>
  );
}

export default StatisticsHistoryPage;
