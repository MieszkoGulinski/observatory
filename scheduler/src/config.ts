import "dotenv/config";

export type Config = {
  serialPort: string;
  baudRate: number;
  logToFile: boolean;
  filesPath: string; // working directory with log files, raw images, SQLite DB
  httpPort: number; // port for the REST API
  latitude: number;
  longitude: number;
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
};

export default config;
