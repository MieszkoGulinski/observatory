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
    temperature: number;
    humidity: number;
    batteryVoltage: number;
  };
  osLoad: {
    uptime: number;
    freeMemory: number;
    totalMemory: number;
    load1: number;
    load5: number;
    load15: number;
  };
};

function StatusPage() {
  const { data, error, isLoading } = useSWR<StatusData>("/status", fetcher);

  if (isLoading) return <>Loading...</>;
  if (error) return <>Error loading data</>;

  return (
    <div>
      <table>
        <tbody>
          <tr className="border-b">
            <td>Current time</td>
            <td>{new Date(data.time).toISOString()}</td>
          </tr>
          <tr>
            <td>Roof state</td>
            <td>{data.controllerState.roofState}</td>
          </tr>
          <tr>
            <td>Opening allowed?</td>
            <td>{data.controllerState.openingAllowed ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Tracking status</td>
            <td>{data.controllerState.trackingStatus}</td>
          </tr>
          <tr>
            <td>Declination [deg]</td>
            <td>{data.controllerState.dec}</td>
          </tr>
          <tr className="border-b">
            <td>Local Hour Angle [deg]</td>
            <td>{data.controllerState.lha}</td>
          </tr>
          <tr>
            <td>Temperature [C]</td>
            <td>{data.controllerState.temperature}</td>
          </tr>
          <tr>
            <td>Humidity [%]</td>
            <td>{data.controllerState.humidity}</td>
          </tr>
          <tr className="border-b">
            <td>Battery voltage [V]</td>
            <td>{data.controllerState.batteryVoltage}</td>
          </tr>
          <tr>
            <td>Uptime [s]</td>
            <td>{data.osLoad.uptime}</td>
          </tr>
          <tr>
            <td>Free/Total memory [MiB]</td>
            <td>
              {(data.osLoad.freeMemory / 1024 / 1024).toFixed(2)} /{" "}
              {(data.osLoad.totalMemory / 1024 / 1024).toFixed(2)} (
              {(
                (data.osLoad.freeMemory / data.osLoad.totalMemory) *
                100
              ).toFixed(2)}
              %)
            </td>
          </tr>
          <tr>
            <td>1 min load</td>
            <td>{data.osLoad.load1}</td>
          </tr>
          <tr>
            <td>5 min load</td>
            <td>{data.osLoad.load5}</td>
          </tr>
          <tr>
            <td>15 min load</td>
            <td>{data.osLoad.load15}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatusPage;
