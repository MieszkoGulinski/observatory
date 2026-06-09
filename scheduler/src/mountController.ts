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

class MountController {
  serialPortMountController: SerialPortMountController;
  lastSensorState: SensorState | null = null;

  constructor(serialPortMountController: SerialPortMountController) {
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
  };

  sendCloseCommand() {
    this.sendCommand("CLOSE");
  }
  sendOpenCommand() {
    this.sendCommand("OPEN");
  }
  sendGotoCommand(lha: number, dec: number) {
    this.sendCommand(`GOTO ${this.formatAngle(lha)} ${this.formatAngle(dec)}`);
  }
  sendStopCommand() {
    this.sendCommand("STOP");
  }
  private formatAngle(value: number) {
    return value.toFixed(1).replace(".", "");
  }
  private sendCommand(command: string) {
    this.serialPortMountController.sendCommand(command);
  }
}

export default MountController;
