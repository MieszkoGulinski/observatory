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

function CurrentStatusSection() {
  const { data, error, isLoading } = useSWR<StatusData>(
    "/current-status",
    fetcher,
  );

  if (error) return <ApiErrorMessage error={error} />;
  if (isLoading || !data) return <SpinnerLine />;

  return (
    <div className="flex gap-2 items-start">
      <table>
        <tbody>
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
          <tr>
            <td>Local Hour Angle [deg]</td>
            <td>{data.controllerState?.lha}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
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
          <tr>
            <td>Battery voltage [V]</td>
            <td>{data.controllerState?.batteryVoltage}</td>
          </tr>
          <tr>
            <td>Uptime [s]</td>
            <td>{data.osStats.uptime.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>Free memory [%]</td>
            <td>
              {(
                (data.osStats.freeMemory / data.osStats.totalMemory) *
                100
              ).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>Free memory [MiB]</td>
            <td>{(data.osStats.freeMemory / 1024 / 1024).toFixed(2)}</td>
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
    </div>
  );
}

export default CurrentStatusSection;
