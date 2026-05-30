import pino from "pino";
import path from "node:path";
import config from "./config.ts";

const logger = pino(
  {
    base: undefined, // don't include process ID, hostname, etc.
  },
  config.logToFile
    ? pino.destination(path.join(config.filesPath, "logs.txt"))
    : undefined, // stdout
);
export default logger;
