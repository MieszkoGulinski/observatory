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

  // Message format:
  // First letter: roof status (O=open C=closed o=opening c=closing)
  // Second letter: dangerous weather sensor status (Y=ok N=dangerous weather)
  // Third letter: tracking status (T=tracking active, S=during setting, I=idle)
  onMessage(message: string) {
    const roofStatusLetter = message[0];
    const weatherStatusLetter = message[1];
    const trackingStatusLetter = message[2];

    this.lastSensorState = {
      roofState: this.decodeRoofStatus(roofStatusLetter),
      openingAllowed: this.decodeOpeningAllowed(weatherStatusLetter),
      trackingStatus: this.decodeTrackingStatus(trackingStatusLetter),
    };
    this.resetWatchdog();
  }

  private decodeRoofStatus(letter: string): RoofState {
    switch (letter) {
      case "O":
        return "OPEN";
      case "C":
        return "CLOSED";
      case "o":
        return "OPENING";
      case "c":
        return "CLOSING";
      default:
        throw new Error(`Unknown roof status letter: ${letter}`);
    }
  }

  private decodeOpeningAllowed(letter: string): boolean {
    switch (letter) {
      case "Y":
        return true;
      case "N":
        return false;
      default:
        throw new Error(`Unknown opening allowed letter: ${letter}`);
    }
  }

  private decodeTrackingStatus(letter: string): TrackingStatus {
    switch (letter) {
      case "T":
        return "TRACKING";
      case "S":
        return "SETTING";
      case "I":
        return "IDLE";
      default:
        throw new Error(`Unknown tracking status letter: ${letter}`);
    }
  }

  // Available commands are:
  // - H - heartbeat
  // - O - open roof
  // - C - close roof
  // - R17000005 - rotate to given coordinates, with 0.1 deg resolution and start tracking

  // 4 digits for local hour angle with 180 degree offset from meridian plane
  // Setting RA drive exactly to the meridian plane would be indicated as 1800.
  // Offset is used to avoid negative values in hour angle.
  // In this example 1700 = 170 deg, i.e. -10 deg from meridian (west)

  // 4 digits for polar angle, in this example 0005 = 0.5 degree = +89.5 degrees declination
  // Polar angle for southern celestial hemisphere will be greater than 90 degrees,
  // e.g. 1005 = 100.5 degrees from northern celestial pole = -10.5 degrees declination

  sendHeartbeat() {
    this.sendCommand("H");
  }
  sendCloseCommand() {
    this.sendCommand("C");
  }
  sendOpenCommand() {
    this.sendCommand("O");
  }
  private formatAngle(value: number) {
    return value.toFixed(1).replace(".", "").padStart(4, "0");
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
