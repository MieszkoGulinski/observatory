import ApiErrorMessage from "@/components/ApiErrorMessage";
import SpinnerLine from "@/components/SpinnerLine";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/utils";
import useSWR from "swr";

// TODO share the same types in scheduler and React frontend (both use TypeScript)
type StatusData = {
  time: number;
  controllerState: {
    roofState: "OPEN" | "CLOSED" | "OPENING" | "CLOSING";
    trackingStatus: "TRACKING" | "SETTING" | "IDLE";
    dec: number;
    lha: number;
    openingAllowed: boolean;
    airTemperature: number;
    cameraTemperature: number;
    humidity: number;
    batteryVoltage: number;
  } | null;
  osStats: {
    uptime: number;
    freeMemory: number;
    totalMemory: number;
    load1: number;
    load5: number;
    load15: number;
  };
};

function StatusPage() {
  const { data, error, isLoading, mutate } = useSWR<StatusData>(
    "/current-status",
    fetcher,
  );

  if (error) return <ApiErrorMessage error={error} />;
  if (isLoading || !data) return <SpinnerLine />;

  return (
    <div>
      <table className="stats-table">
        <tbody>
          <tr className="border-b">
            <td>Current time</td>
            <td>{new Date(data.time).toISOString()}</td>
          </tr>
          <tr>
            <td>Roof state</td>
            <td>{data.controllerState?.roofState}</td>
          </tr>
          <tr>
            <td>Opening allowed?</td>
            <td>{data.controllerState?.openingAllowed ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Tracking status</td>
            <td>{data.controllerState?.trackingStatus}</td>
          </tr>
          <tr>
            <td>Declination [deg]</td>
            <td>{data.controllerState?.dec}</td>
          </tr>
          <tr className="border-b">
            <td>Local Hour Angle [deg]</td>
            <td>{data.controllerState?.lha}</td>
          </tr>
          <tr>
            <td>Camera temperature [C]</td>
            <td>{data.controllerState?.cameraTemperature}</td>
          </tr>
          <tr>
            <td>Air temperature [C]</td>
            <td>{data.controllerState?.airTemperature}</td>
          </tr>
          <tr>
            <td>Humidity [%]</td>
            <td>{data.controllerState?.humidity}</td>
          </tr>
          <tr className="border-b">
            <td>Battery voltage [V]</td>
            <td>{data.controllerState?.batteryVoltage}</td>
          </tr>
          <tr>
            <td>Uptime [s]</td>
            <td>{data.osStats.uptime}</td>
          </tr>
          <tr>
            <td>Free/Total memory [MiB]</td>
            <td>
              {(data.osStats.freeMemory / 1024 / 1024).toFixed(2)} /{" "}
              {(data.osStats.totalMemory / 1024 / 1024).toFixed(2)} (
              {(
                (data.osStats.freeMemory / data.osStats.totalMemory) *
                100
              ).toFixed(2)}
              %)
            </td>
          </tr>
          <tr>
            <td>1 min load</td>
            <td>{data.osStats.load1}</td>
          </tr>
          <tr>
            <td>5 min load</td>
            <td>{data.osStats.load5}</td>
          </tr>
          <tr>
            <td>15 min load</td>
            <td>{data.osStats.load15}</td>
          </tr>
        </tbody>
      </table>

      <Button onClick={() => mutate()}>Refresh</Button>
    </div>
  );
}

export default StatusPage;
