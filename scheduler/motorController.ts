import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";

const WATCHDOG_TIME_MS = 60000; // 1 minute

class MotorController {
  serialPort: SerialPort;
  timeout?: NodeJS.Timeout;

  constructor(path: string, baudRate: number) {
    console.log("Attempting to open port", path);
    try {
      this.serialPort = new SerialPort({
        path,
        baudRate,
      });
    } catch (error) {
      console.error("Failed to open port", error);
      process.exit(1);
    }
    // TODO pino for logging, redirect to log file
    console.log("Successfully opened port");

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
    console.error("Watchdog timeout");
    // TODO log error and crash the process
  }
}

export default MotorController;
