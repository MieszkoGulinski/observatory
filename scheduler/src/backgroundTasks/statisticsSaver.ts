import os from "node:os";
import db from "../db/index.ts";
import { statistics, type InsertStatistics } from "../db/schema.ts";
import MountController from "./mountController/index.ts";

const STATUS_UPDATE_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes

class StatisticsSaver {
  private mountControllerClient: MountController;
  constructor(mountControllerClient: MountController) {
    this.mountControllerClient = mountControllerClient;
  }

  interval: NodeJS.Timeout | null = null;
  run() {
    this.interval = setInterval(
      () => this.saveStatistics(),
      STATUS_UPDATE_INTERVAL_MS,
    );
  }

  getOSStats(): Pick<
    InsertStatistics,
    "uptime" | "freeMemory" | "totalMemory" | "load1" | "load5" | "load15"
  > {
    const uptime = os.uptime();
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const load = os.loadavg();

    return {
      uptime,
      freeMemory,
      totalMemory,
      load1: load[0],
      load5: load[1],
      load15: load[2],
    };
  }

  getStatistics(): InsertStatistics | null {
    const sensorState = this.mountControllerClient.lastSensorState;
    if (sensorState === null) return null;

    const osStats = this.getOSStats();

    return {
      timestamp: Date.now(),

      cameraTemperature: sensorState.cameraTemperature,
      airTemperature: sensorState.airTemperature,
      humidity: sensorState.humidity,
      batteryVoltage: sensorState.batteryVoltage,

      ...osStats,
    };
  }

  saveStatistics() {
    const statisticsObj = this.getStatistics();
    if (statisticsObj === null) return;
    db.insert(statistics).values(statisticsObj).execute();
  }
}

export default StatisticsSaver;
