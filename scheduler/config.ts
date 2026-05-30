import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type Config = {
  port: string;
  baudRate: number;
  logToFile: boolean;
  filesPath: string | undefined; // working directory with log files, raw images, SQLite DB
};

// TS types show that argv may be a Promise or a regular object, but in practice it's always a regular object.
const argv = yargs(hideBin(process.argv)).parse() as Record<string, unknown>;

console.log(argv);

const config: Config = {
  port: (argv.port as string | undefined) ?? "/dev/ttyS4",
  baudRate: (argv.baudRate as number) ?? 9600,
  logToFile: (argv.logToFile as boolean) ?? false,
  filesPath: (argv.filesPath as string | undefined) ?? ".",
};

export default config;
