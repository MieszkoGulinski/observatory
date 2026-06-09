// To run the simulator, use this command:
// npm run simulator /dev/pts/9
// where /dev/pts/9 is the serial port to use in the simulator

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

  submitMessage() {
    const lha = 45;
    const dec = -10;
    const airTemperature = -15;
    const cameraTemperature = -5;
    const skyTemperature = -50;
    const humidity = 65;
    const batteryVoltage = 12;

    this.serialPort.write(
      `OPEN COND_OK TRACKING ${lha * 10} ${dec * 10} ${airTemperature} ${cameraTemperature} ${skyTemperature} ${humidity} ${batteryVoltage * 10}\n`,
    );
  }

  run() {
    try {
      setInterval(() => {
        this.submitMessage();
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
