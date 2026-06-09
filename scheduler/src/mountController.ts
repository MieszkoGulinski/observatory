import EventEmitter from "node:events";
import type SerialPortMountController from "./serialPortMountController.ts";

type RoofState = "OPEN" | "CLOSED" | "OPENING" | "CLOSING";
type TrackingStatus = "TRACKING" | "SETTING" | "IDLE";
type SensorState = {
  roofState: RoofState;
  conditionsSuitableForObservation: boolean;
  trackingStatus: TrackingStatus;
  lha: number;
  dec: number;
  airTemperature: number;
  cameraTemperature: number;
  skyTemperature: number;
  humidity: number;
  batteryVoltage: number;
};

// Handles communications with the microcontroller board controlling the rotator
// and roof motors and sensors. Note that the microcontroller will auto-close the
// roof in case of detecting bad weather independently of commands from the
// scheduler.

// For readability, code is split into two layers, one for communicating with
// UART, one for exposing API relevant to the microcontroller functionality.

class MountController extends EventEmitter {
  serialPortMountController: SerialPortMountController;
  lastSensorState: SensorState | null = null;
  isRunningCommand: boolean = false;

  constructor(serialPortMountController: SerialPortMountController) {
    super();
    this.serialPortMountController = serialPortMountController;
    this.serialPortMountController.on("message", this.onMessage);
  }

  // See docs/protocol.md for message format
  // Example message: OPEN COND_OK TRACKING 450 -100 -15 -5 -50 65 127
  onMessage = (message: string) => {
    const splitMessage = message.split(" ");
    const roofStatusWord = splitMessage[0];
    const weatherStatusWord = splitMessage[1];
    const trackingStatusWord = splitMessage[2];

    this.lastSensorState = {
      roofState: roofStatusWord as RoofState,
      conditionsSuitableForObservation: weatherStatusWord === "COND_OK",
      trackingStatus: trackingStatusWord as TrackingStatus,
      lha: parseInt(splitMessage[3]) / 10,
      dec: parseInt(splitMessage[4]) / 10,
      airTemperature: parseInt(splitMessage[5]),
      cameraTemperature: parseInt(splitMessage[6]),
      skyTemperature: parseInt(splitMessage[7]),
      humidity: parseInt(splitMessage[8]),
      batteryVoltage: parseInt(splitMessage[9]) / 10,
    };

    this.emit("sensorState", this.lastSensorState);
  };

  sendCloseCommand() {
    return this.sendCommand(
      "CLOSE",
      (sensorState: SensorState) =>
        sensorState.roofState === "CLOSED" ||
        sensorState.roofState === "CLOSING",
    );
  }

  sendOpenCommand() {
    return this.sendCommand(
      "OPEN",
      (sensorState: SensorState) =>
        sensorState.roofState === "OPEN" || sensorState.roofState === "OPENING",
    );
  }

  sendGotoCommand(lha: number, dec: number) {
    return this.sendCommand(
      `GOTO ${this.formatAngle(lha)} ${this.formatAngle(dec)}`,
      (sensorState: SensorState) => sensorState.trackingStatus === "TRACKING",
    );
  }

  sendStopCommand() {
    return this.sendCommand(
      "STOP",
      (sensorState: SensorState) => sensorState.trackingStatus === "IDLE",
    );
  }

  private formatAngle(value: number) {
    return value.toFixed(1).replace(".", "");
  }

  // TODO: currently we rely on external logic to never submit commands when another command is running.
  // It may be more robust to create a queue instead.
  private sendCommand(
    command: string,
    isCommandAccepted: (sensorState: SensorState) => boolean,
    commandTimeoutMs: number = 30000,
  ): Promise<void> {
    if (this.isRunningCommand) {
      throw new Error(
        "Command already running - running multiple commands concurrently is not supported.",
      );
    }
    this.isRunningCommand = true;

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.isRunningCommand = false;
        reject(new Error("Command timeout"));
      }, commandTimeoutMs);

      const stateListener = (sensorState: SensorState) => {
        if (!isCommandAccepted(sensorState)) return;

        clearTimeout(timeout);
        this.isRunningCommand = false;
        this.removeListener("sensorState", stateListener);

        resolve();
      };

      this.on("sensorState", stateListener);

      this.serialPortMountController.sendCommand(command);
    });
  }
}

export default MountController;
