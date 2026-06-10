// To run the simulator, use this command:
// npm run simulator /dev/pts/9
// where /dev/pts/9 is the serial port to use in the simulator

import { DelimiterParser, SerialPort } from "serialport";
import type {
  RoofState,
  TrackingStatus,
} from "../backgroundTasks/mountController/index.ts";

const MESSAGE_INTERVAL_MS = 5000;
const SIMULATED_ROOF_RESPONSE_DELAY_MS = 5000;
const SIMULATED_MOUNT_RESPONSE_DELAY_MS = 10000;

const portName = process.argv[2];
console.log("Starting simulator on port name ", portName);

class Simulator {
  serialPort: SerialPort;
  roofState: RoofState;
  trackingStatus: TrackingStatus;

  constructor(path: string) {
    this.serialPort = new SerialPort({
      path,
      baudRate: 115200,
    });
    this.roofState = "OPEN";
    this.trackingStatus = "IDLE";
  }

  submitMessage = () => {
    // Edit this method to simulate unsuitable conditions.

    const lha = 45;
    const dec = -10;
    const airTemperature = -15;
    const cameraTemperature = -5;
    const skyTemperature = -50;
    const humidity = 65;
    const batteryVoltage = 12;

    const conditionsSuitableForObservation = true;

    const conditionsWord = conditionsSuitableForObservation
      ? "COND_OK"
      : "COND_BAD";

    this.serialPort.write(
      `${this.roofState} ${conditionsWord} ${this.trackingStatus} ${lha * 10} ${dec * 10} ${airTemperature} ${cameraTemperature} ${skyTemperature} ${humidity} ${batteryVoltage * 10}\n`,
    );
  };

  run() {
    try {
      setInterval(this.submitMessage, MESSAGE_INTERVAL_MS);

      const parser = this.serialPort.pipe(
        new DelimiterParser({ delimiter: "\n" }),
      );
      parser.on("data", this.onMessage);
    } catch (error) {
      console.error("Error starting simulator: ", error);
      process.exit(1);
    }
  }

  onMessage = (data: Buffer) => {
    const message = data.toString();

    // Edit this method to simulate failure cases
    // For example, if the roof fails to close when it should,
    // do not update roofState to CLOSED in the timeout below.

    // Simulate closing/opening
    if (message === "CLOSE") {
      this.roofState = "CLOSING";
      // closing the roof automatically stops tracking too
      this.trackingStatus = "IDLE";
      setTimeout(() => {
        this.roofState = "CLOSED";
      }, SIMULATED_ROOF_RESPONSE_DELAY_MS);
    }
    if (message === "OPEN") {
      this.roofState = "OPENING";
      setTimeout(() => {
        this.roofState = "OPEN";
      }, SIMULATED_ROOF_RESPONSE_DELAY_MS);
    }

    // Simulate pointing to a new LHA/DEC
    if (message.startsWith("GOTO")) {
      this.trackingStatus = "SETTING";
      setTimeout(() => {
        this.trackingStatus = "TRACKING";
      }, SIMULATED_MOUNT_RESPONSE_DELAY_MS);
    }

    // Simulate stopping tracking
    if (message === "STOP") {
      this.trackingStatus = "IDLE";
    }
  };
}

const simulator = new Simulator(portName);
simulator.run();
