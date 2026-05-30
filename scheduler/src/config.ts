import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
const argv = yargs(hideBin(process.argv)).parse() as Record<string, unknown>;

const config: Config = {
  serialPort: (argv.port as string | undefined) ?? "/dev/ttyS4",
  baudRate: (argv.baudRate as number) ?? 9600,
  logToFile: (argv.logToFile as boolean) ?? false,
  filesPath: (argv.filesPath as string | undefined) ?? ".",
  httpPort: (argv.httpPort as number) ?? 8080,
  latitude: (argv.latitude as number) ?? 54,
  longitude: (argv.longitude as number) ?? 18,
};

export default config;
