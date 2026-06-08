import { Button } from "@/components/ui/button";
import { fetcher } from "@/utils";
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

// TODO add UI for setting search start and end times
const searchEndTime = Date.now();
const searchStartTime = searchEndTime - 24 * 60 * 60 * 1000; // 24 hours

function StatisticsHistoryPage() {
  const { data, error, isLoading, mutate } = useSWR<StatisticsRow[]>(
    `/statistics?start=${searchStartTime}&end=${searchEndTime}`,
    fetcher,
  );

  if (isLoading) return <>loading...</>;
  if (error) return <>error</>;

  return (
    <>
      <h1>Statistics history</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Button onClick={() => mutate()}>Refresh</Button>
    </>
  );
}

export default StatisticsHistoryPage;
