import "dotenv/config";

export type Config = {
  serialPort: string;
  baudRate: number;
  logToFile: boolean;
  filesPath: string; // working directory with log files, raw images, SQLite DB
  httpPort: number; // port for the REST API

  // Observatory position
  latitude: number;
  longitude: number;

  // Import filters
  maxDeclination?: number; // maximum declination of stars that can be observed
  minDeclination?: number; // minimum declination of stars that can be observed
  maxMagnitude?: number; // maximum magnitude of stars that can be observed
  minAmplitude?: number; // minimum amplitude of stars that can be observed
};

// TS types show that argv may be a Promise or a regular object, but in practice it's always a regular object.
const config: Config = {
  serialPort: process.env.SERIAL_PORT as string,
  baudRate: parseInt(process.env.BAUD_RATE as string, 10),
  logToFile: (process.env.LOG_TO_FILE as string) === "true",
  filesPath: process.env.FILES_PATH as string,
  httpPort: parseInt(process.env.HTTP_PORT as string, 10),
  latitude: parseFloat(process.env.LATITUDE as string),
  longitude: parseFloat(process.env.LONGITUDE as string),
  maxDeclination: process.env.IMPORT_MAX_DECLINATION
    ? parseFloat(process.env.IMPORT_MAX_DECLINATION as string)
    : undefined,
  minDeclination: process.env.IMPORT_MIN_DECLINATION
    ? parseFloat(process.env.IMPORT_MIN_DECLINATION as string)
    : undefined,
  minAmplitude: process.env.IMPORT_LIMIT_AMPLITUDE
    ? parseFloat(process.env.IMPORT_LIMIT_AMPLITUDE as string)
    : undefined,
  maxMagnitude: process.env.IMPORT_LIMIT_MAG
    ? parseFloat(process.env.IMPORT_LIMIT_MAG as string)
    : undefined,
};

export default config;
