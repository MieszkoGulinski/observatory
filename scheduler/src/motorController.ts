import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter"; // TODO TypeScript does not recognize types here
import logger from "./logger.ts";

const WATCHDOG_TIME_MS = 60000; // 1 minute
const HEARTBEAT_INTERVAL_MS = 5000; // 5 seconds

type RoofState = "OPEN" | "CLOSED" | "OPENING" | "CLOSING";
type TrackingStatus = "TRACKING" | "SETTING" | "IDLE";
type SensorState = {
  roofState: RoofState;
  openingAllowed: boolean;
  trackingStatus: TrackingStatus;
  lha: number;
  dec: number;
  temperature: number;
  humidity: number;
  batteryVoltage: number;
};

// Handles communications with the microcontroller board controlling the rotator
// and roof motors and sensors. Note that the microcontroller will auto-close the
// roof in case of detecting bad weather independently of commands from the
// scheduler.

class MotorController {
  serialPort: SerialPort;
  timeout?: NodeJS.Timeout;
  lastSensorState: SensorState | null = null;

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

    // Heartbeat to microcontroller
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

  resetWatchdog() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.onTimeout, WATCHDOG_TIME_MS);
  }

  onTimeout() {
    logger.error("Motor controller watchdog timeout");
    process.exit(1);
  }

  // See docs/protocol.md for message format
  onMessage(message: string) {
    const splitMessage = message.split(" ");
    const roofStatusWord = splitMessage[0];
    const weatherStatusLetter = splitMessage[1];
    const trackingStatusLetter = splitMessage[2];

    this.lastSensorState = {
      roofState: roofStatusWord as RoofState,
      openingAllowed: weatherStatusLetter === "COND_OK",
      trackingStatus: trackingStatusLetter as TrackingStatus,
      lha: parseInt(splitMessage[3]) / 10,
      dec: parseInt(splitMessage[4]) / 10,
      temperature: parseInt(splitMessage[5]),
      humidity: parseInt(splitMessage[6]),
      batteryVoltage: parseInt(splitMessage[7]) / 10,
    };
    this.resetWatchdog();
  }

  sendHeartbeat() {
    this.sendCommand("HEARTBEAT");
  }
  sendCloseCommand() {
    this.sendCommand("CLOSE");
  }
  sendOpenCommand() {
    this.sendCommand("OPEN");
  }
  sendGotoCommand(lha: number, dec: number) {
    this.sendCommand(`GOTO ${lha} ${dec}`);
  }
  sendStopCommand() {
    this.sendCommand("STOP");
  }
  private formatAngle(value: number) {
    return value.toFixed(1).replace(".", "");
  }
  sendCoordinatesCommand(offsetLHA: number, polarAngle: number) {
    this.sendCommand(
      `R${this.formatAngle(offsetLHA)}${this.formatAngle(polarAngle)}`,
    );
  }
  private sendCommand(command: string) {
    this.serialPort.write(command + "\n");
  }
}

export default MotorController;
