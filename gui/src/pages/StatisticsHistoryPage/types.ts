// TODO share the same types in scheduler and React frontend (both use TypeScript)
export type StatisticsRowFromServer = {
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

export type StatisticsRow = StatisticsRowFromServer & {
  usedRAMPercent: number;
};
