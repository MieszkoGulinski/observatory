import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import logger from "../logger.ts";
import EventEmitter from "node:events";

const WATCHDOG_TIME_MS = 60000; // 1 minute
const HEARTBEAT_INTERVAL_MS = 5000; // 5 seconds

class SerialPortMountController extends EventEmitter {
  private serialPort: SerialPort;
  private timeout?: NodeJS.Timeout;
  private heartbeatMessage: string;

  constructor(
    path: string,
    baudRate: number = 115200,
    heartbeatMessage: string = "HEARTBEAT",
  ) {
    super();
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

    // Heartbeat to microcontroller
    this.heartbeatMessage = heartbeatMessage;
    setInterval(() => {
      this.sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    // Start listening
    const parser = this.serialPort.pipe(
      new DelimiterParser({ delimiter: "\n" }),
    );
    parser.on("data", (data: Buffer) => {
      this.onMessage(data.toString());
    });
  }

  private resetWatchdog() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.onTimeout, WATCHDOG_TIME_MS);
  }

  private onTimeout = () => {
    logger.error("Motor controller watchdog timeout");
    process.exit(1);
  };

  private sendHeartbeat() {
    this.serialPort.write(this.heartbeatMessage + "\n");
  }

  private onMessage(data: string) {
    this.resetWatchdog();
    this.emit("message", data);
  }

  public sendCommand(command: string) {
    this.serialPort.write(command + "\n");
  }
}

export default SerialPortMountController;
