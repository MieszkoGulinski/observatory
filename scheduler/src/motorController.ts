import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import logger from "./logger.ts";

const WATCHDOG_TIME_MS = 60000; // 1 minute

type SensorState = {
  roofState: string; // TODO enum
  cloudCover: number;
  temperature: number;
  humidity: number;
};

class MotorController {
  serialPort: SerialPort;
  timeout?: NodeJS.Timeout;
  lastSensorState: SensorState;

  constructor(path: string, baudRate: number) {
    logger.info("Attempting to open port %s", path);
    try {
      this.serialPort = new SerialPort({
        path,
        baudRate,
      });
    } catch (error) {
      logger.fatal(error, "Failed to open port");
      process.exit(1);
    }
    logger.info("Successfully opened port");

    // Watchdog
    this.resetWatchdog();

    // Start listening
    const parser = this.serialPort.pipe(
      new DelimiterParser({ delimiter: "\n" }),
    );
    parser.on("data", (data: Buffer) => {
      // TODO handle the incoming message
      console.log("data", data.toString());
      this.resetWatchdog();
    });
  }

  resetWatchdog() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.onTimeout, WATCHDOG_TIME_MS);
  }

  onTimeout() {
    logger.error("Watchdog timeout");
    process.exit(1);
  }
}

export default MotorController;
