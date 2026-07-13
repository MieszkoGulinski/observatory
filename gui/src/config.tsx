import useSWRImmutable from "swr/immutable";
import { fetcher } from "./utils";
import { createContext, useContext } from "react";
import SpinnerLine from "./components/SpinnerLine";
import ApiErrorMessage from "./components/ApiErrorMessage";

export type Config = {
  serialPort: string;
  baudRate: number;
  logToFile: boolean;
  filesPath: string; // working directory with log files, raw images, SQLite DB
  httpPort: number; // port for the REST API

  // Observatory position
  latitude: number;
  longitude: number;

  // Time zone for the scheduler
  schedulerTimeZone: string;

  // Import filters
  maxDeclination?: number; // maximum declination of stars that can be observed
  minDeclination?: number; // minimum declination of stars that can be observed
  maxMagnitude?: number; // maximum magnitude of stars that can be observed
  minAmplitude?: number; // minimum amplitude of stars that can be observed
};

const ConfigContext = createContext<Config | null>(null);

export const useConfig = () => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return config;
};

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useSWRImmutable<Config>(
    "/config",
    fetcher,
  );
  if (isLoading) {
    return <SpinnerLine />;
  }

  if (error) {
    return <ApiErrorMessage error={error} />;
  }

  return (
    <ConfigContext.Provider value={data ?? null}>
      {children}
    </ConfigContext.Provider>
  );
};
