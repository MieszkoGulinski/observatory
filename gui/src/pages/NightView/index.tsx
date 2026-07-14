import Layout from "@/Layout";
import useSWRImmutable from "swr/immutable";

import { useConfig } from "@/config";
import { useParams } from "react-router";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { fetcher } from "@/utils";
import type { ScheduleEntry } from "./types";
import SpinnerLine from "@/components/SpinnerLine";
import ApiErrorMessage from "@/components/ApiErrorMessage";

dayjs.extend(timezone);
dayjs.extend(utc);

function NightView() {
  const { date } = useParams<{ date: string }>();
  const { schedulerTimeZone } = useConfig();

  const startTimestamp = dayjs(date)
    .tz(schedulerTimeZone)
    .startOf("day")
    .add(12, "hour");
  const endTimestamp = dayjs(startTimestamp)
    .tz(schedulerTimeZone)
    .add(1, "day");

  let status: string;
  if (Date.now() < startTimestamp.valueOf()) {
    status = "Upcoming";
  } else if (Date.now() > endTimestamp.valueOf()) {
    status = "Past";
  } else {
    status = "Active";
  }

  const {
    data: stars,
    isLoading,
    error,
  } = useSWRImmutable<ScheduleEntry[]>(
    `/schedule?start=${startTimestamp.valueOf()}&end=${endTimestamp.valueOf()}`,
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
