import EventEmitter from "node:events";
import type SerialPortMountController from "../serialPortMountController.ts";
import logger from "../../logger.ts";
import type { RoofState, SensorState, TrackingStatus } from "./types.ts";
import parseMessage from "./parseMessage.ts";

/**
 * Handles communications with the microcontroller board controlling the rotator
 * and roof motors and sensors. Note that the microcontroller will auto-close the
 * roof in case of detecting bad weather independently of commands from the
 * scheduler.
 *
 * For readability, code is split into two layers, one for communicating with
 * UART, one for exposing API relevant to the microcontroller functionality.
 */

class MountController extends EventEmitter {
  serialPortMountController: SerialPortMountController;
  lastSensorState: SensorState | null = null;
  isRunningCommand: boolean = false;

  constructor(serialPortMountController: SerialPortMountController) {
    super();
    this.serialPortMountController = serialPortMountController;
    this.serialPortMountController.on("message", this.onMessage);
  }

  onMessage = (message: string) => {
    this.lastSensorState = parseMessage(message);
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
    logger.info(`Submitting command ${command}`);

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

        logger.info(`Command ${command} succesfully executed`);
        resolve();
      };

      this.on("sensorState", stateListener);

      this.serialPortMountController.sendCommand(command);
    });
  }
}

export default MountController;
