import Layout from "@/Layout";
import useSWRImmutable from "swr/immutable";
import { useConfig } from "@/config";
import { useParams } from "react-router";
import { fetcher } from "@/utils";
import type { ScheduleEntry } from "./types";
import SpinnerLine from "@/components/SpinnerLine";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import getNightStartEndStatus from "@/calculations/getNightStartEndStatus";

function NightView() {
  const { date } = useParams<{ date: string }>();
  const { schedulerTimeZone } = useConfig();

  const [startTimestamp, endTimestamp, status] = getNightStartEndStatus(
    date!,
    schedulerTimeZone,
  );

  const {
    data: stars,
    isLoading,
    error,
  } = useSWRImmutable<ScheduleEntry[]>(
    `/schedule?start=${startTimestamp}&end=${endTimestamp}`,
    fetcher,
  );

  if (error) return <ApiErrorMessage error={error} />;
  if (isLoading || !stars) return <SpinnerLine />;

  return (
    <Layout>
      <div>
        Schedule for {date}: {status}
        {stars.length === 0 ? <div>No observations scheduled</div> : null}
      </div>
    </Layout>
  );
}

export default NightView;
