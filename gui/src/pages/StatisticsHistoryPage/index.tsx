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
        <StatisticsChart
          data={data}
          dataKey="cameraTemperature"
          label="Camera temperature"
          color="#ff0000"
        />
      ) : null}
    </>
  );
}

export default StatisticsHistoryPage;
