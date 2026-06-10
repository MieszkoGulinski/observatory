import { exec } from "node:child_process";

const DEFAULT_CLI_COMMAND_TIMEOUT = 10000;

export const runCliCommand = (
  cmd: string,
  timeout: number = DEFAULT_CLI_COMMAND_TIMEOUT,
) => {
  return new Promise<void>((resolve, reject) => {
    exec(cmd, { timeout, killSignal: "SIGKILL" }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
