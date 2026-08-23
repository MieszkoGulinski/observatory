import Layout from "@/Layout";
import useSWRImmutable from "swr/immutable";
import { useConfig } from "@/config";
import { useParams } from "react-router";
import { fetcher } from "@/utils";
import type { ScheduleEntry } from "./types";
import SpinnerLine from "@/components/SpinnerLine";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import getNightStartEndStatus from "@/calculations/getNightStartEndStatus";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddBiasDarkFrames from "./AddBiasDarkFrames";
import AddFlatFrames from "./AddFlatFrames";
import AddLongPeriodVariables from "./AddLongPeriodVariables";

type PresetWindow = "biasDark" | "flat" | "lpv";

function NightView() {
  const { date } = useParams<{ date: string }>();
  const { schedulerTimeZone } = useConfig();
  const [activePresetWindow, setActivePresetWindow] =
    useState<PresetWindow | null>(null);

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

  const clearSchedule = () => {
    if (!window.confirm("Delete all scheduled observations from this day?"))
      return;
    // TODO complete
  };

  return (
    <Layout>
      <div>
        Schedule for {date}: {status}
        <div className="flex gap-2">
          <Button onClick={() => setActivePresetWindow("biasDark")}>
            Add bias/dark frames
          </Button>
          <Button onClick={() => setActivePresetWindow("flat")}>
            Add flat frames
          </Button>
          <Button onClick={() => setActivePresetWindow("lpv")}>
            Add long period variables
          </Button>
          <Button variant="destructive" onClick={clearSchedule}>
            Clear schedule
          </Button>
        </div>
        {stars.length === 0 ? <div>No observations scheduled</div> : null}
        {activePresetWindow === "biasDark" ? (
          <AddBiasDarkFrames onClose={() => setActivePresetWindow(null)} />
        ) : null}
        {activePresetWindow === "flat" ? (
          <AddFlatFrames onClose={() => setActivePresetWindow(null)} />
        ) : null}
        {activePresetWindow === "lpv" ? (
          <AddLongPeriodVariables onClose={() => setActivePresetWindow(null)} />
        ) : null}
      </div>
    </Layout>
  );
}

export default NightView;
