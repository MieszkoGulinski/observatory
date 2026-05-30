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

// Handles communications with the microcontroller board controlling the rotator
// and roof motors and sensors. Note that the microcontroller will auto-close the
// roof in case of detecting bad weather independently of commands from the
// scheduler.

class MotorController {
  serialPort: SerialPort;
  timeout?: NodeJS.Timeout;
  lastSensorState: SensorState | null;

  constructor(path: string, baudRate: number) {
    logger.info("Attempting to open serial port %s", path);
    try {
      this.serialPort = new SerialPort({
        path,
        baudRate,
      });
    } catch (error) {
      logger.fatal(error, "Failed to open serial port");
      process.exit(1);
    }
    logger.info("Successfully opened serial port");

    // Watchdog
    this.resetWatchdog();

    // Start listening
    const parser = this.serialPort.pipe(
      new DelimiterParser({ delimiter: "\n" }),
    );
    parser.on("data", (data: Buffer) => {
      // TODO handle the incoming message, decode it and update lastSensorState
      console.log("data", data.toString());
      this.resetWatchdog();
    });
  }

  resetWatchdog() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.onTimeout, WATCHDOG_TIME_MS);
  }

  onTimeout() {
    logger.error("Motor controller watchdog timeout");
    process.exit(1);
  }

  async sendCommand(command: string) {
    //
  }
}

export default MotorController;
