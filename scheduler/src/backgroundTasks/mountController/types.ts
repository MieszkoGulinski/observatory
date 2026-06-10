export type RoofState = "OPEN" | "CLOSED" | "OPENING" | "CLOSING";
export type TrackingStatus = "TRACKING" | "SETTING" | "IDLE";

export type SensorState = {
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
