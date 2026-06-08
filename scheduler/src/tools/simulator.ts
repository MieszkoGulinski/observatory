// To run the simulator, use this command:
// npm run simulator /dev/pts/9
// where /dev/pts/9 is the serial port to use in the simulator (see README for instructions)

import { DelimiterParser, SerialPort } from "serialport";

const INTERVAL_MS = 5000;

const portName = process.argv[2];
console.log("Starting simulator");
console.log("Port name: ", portName);

class Simulator {
  serialPort: SerialPort;

  constructor(path: string) {
    this.serialPort = new SerialPort({
      path,
      baudRate: 115200,
    });
  }

  run() {
    try {
      setInterval(() => {
        this.serialPort.write("OPEN COND_OK TRACKING 450 -100 -15 65 127\n");
      }, INTERVAL_MS);

      const parser = this.serialPort.pipe(
        new DelimiterParser({ delimiter: "\n" }),
      );
      parser.on("data", this.onMessage);
    } catch (error) {
      console.error("Error starting simulator: ", error);
      process.exit(1);
    }
  }

  onMessage(data: Buffer) {
    console.log(data.toString());
  }
}

const simulator = new Simulator(portName);
simulator.run();
