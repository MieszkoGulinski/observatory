// This script starts the scheduler, simulator and virtual serial port for testing purposes.
// Usage: npm run app-and-simulator

import { spawn } from "node:child_process";
import chalk from "chalk";

// Starts virtual serial port, returns device file paths of both ports.
const startSocat = () => {
  return new Promise<[string, string]>((resolve, reject) => {
    const socatProcess = spawn("socat", [
      "-d",
      "-d",
      "pty,raw,echo=0",
      "pty,raw,echo=0",
    ]);
    // stderr will contain lines:
    // PTY is /dev/pts/2
    // PTY is /dev/pts/3

    let port1 = "";
    let port2 = "";

    socatProcess.stderr.on("data", (data: Buffer) => {
      const output = data.toString();
      const outputLines = output.split("\n");
      outputLines.forEach((line) => {
        if (line.includes("PTY is")) {
          const port = line.split("PTY is")[1].trim();
          if (port1 === "") {
            port1 = port;
          } else {
            port2 = port;
          }

          if (port1 && port2) {
            resolve([port1, port2]);
          }
        }
      });
    });
    socatProcess.on("close", (code) => {
      console.error(`socat process exited with code ${code}`);
      reject();
    });
    socatProcess.on("error", (error) => {
      console.error("Error starting socat: ", error);
      reject(error);
    });
  });
};

const startSimulator = (serialPort: string) => {
  return new Promise<void>((resolve, reject) => {
    const simulatorProcess = spawn("npm", ["run", "simulator", serialPort]);
    simulatorProcess.on("error", (error) => {
      console.error("Error starting simulator: ", error);
      reject(error);
    });
    simulatorProcess.on("close", (code) => {
      console.error(`Simulator process exited with code ${code}`);
      process.exit(code ?? 0);
    });
    simulatorProcess.on("spawn", () => {
      resolve();
    });
    simulatorProcess.stdout.on("data", (data: Buffer) => {
      console.log(chalk.green(data.toString()));
    });
    simulatorProcess.stderr.on("data", (data: Buffer) => {
      console.log(chalk.red(data.toString()));
    });
  });
};

const startApp = (serialPort: string) => {
  return new Promise<void>((resolve, reject) => {
    const appProcess = spawn("npm", ["run", "dev"], {
      env: {
        ...process.env,
        SERIAL_PORT: serialPort,
      },
    });
    appProcess.on("error", (error) => {
      console.error("Error starting app: ", error);
      reject(error);
    });
    appProcess.on("close", (code) => {
      console.error(`App process exited with code ${code}`);
      process.exit(code ?? 0);
    });
    appProcess.on("spawn", () => {
      resolve();
    });
    appProcess.stdout.on("data", (data: Buffer) => {
      console.log(chalk.blue(data.toString()));
    });
    appProcess.stderr.on("data", (data: Buffer) => {
      console.log(chalk.yellow(data.toString()));
    });
  });
};

const start = async () => {
  try {
    const [port1, port2] = await startSocat();

    console.log("Starting app with port: " + port1);
    await startApp(port1);

    console.log("Starting simulator with port: " + port2);
    await startSimulator(port2);
  } catch (error) {
    console.error("Error starting app and simulator: ", error);
    process.exit(1);
  }
};

start();
