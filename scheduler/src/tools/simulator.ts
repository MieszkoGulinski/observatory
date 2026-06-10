// To run the simulator, use this command:
// npm run simulator /dev/pts/9
// where /dev/pts/9 is the serial port to use in the simulator

import { DelimiterParser, SerialPort } from "serialport";
import type { RoofState, TrackingStatus } from "../mountController.ts";

const INTERVAL_MS = 5000;

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
    const lha = 45;
    const dec = -10;
    const airTemperature = -15;
    const cameraTemperature = -5;
    const skyTemperature = -50;
    const humidity = 65;
    const batteryVoltage = 12;

    this.serialPort.write(
      `${this.roofState} COND_OK TRACKING ${lha * 10} ${dec * 10} ${airTemperature} ${cameraTemperature} ${skyTemperature} ${humidity} ${batteryVoltage * 10}\n`,
    );
  };

  run() {
    try {
      setInterval(this.submitMessage, INTERVAL_MS);

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

    // Simulate closing/opening taking 5 seconds
    if (message === "CLOSE") {
      this.roofState = "CLOSING";
      setTimeout(() => {
        this.roofState = "CLOSED";
      }, 5000);
    }
    if (message === "OPEN") {
      this.roofState = "OPENING";
      setTimeout(() => {
        this.roofState = "OPEN";
      }, 5000);
    }

    // Simulate pointing to a new LHA/DEC
    if (message.startsWith("GOTO")) {
      this.trackingStatus = "SETTING";
      setTimeout(() => {
        this.trackingStatus = "TRACKING";
      }, 5000);
    }

    // Simulate stopping tracking
    if (message === "STOP") {
      this.trackingStatus = "IDLE";
    }
  };
}

const simulator = new Simulator(portName);
simulator.run();
