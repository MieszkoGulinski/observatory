import type { RoofState, TrackingStatus } from "./types.ts";

/**
 * Parses the message from the microcontroller board.
 *
 * See docs/protocol.md for message format
 * Example message: OPEN COND_OK TRACKING 450 -100 -15 -5 -50 65 127
 */

function parseMessage(message: string) {
  const splitMessage = message.split(" ");
  const roofStatusWord = splitMessage[0];
  const weatherStatusWord = splitMessage[1];
  const trackingStatusWord = splitMessage[2];

  return {
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
}

export default parseMessage;
