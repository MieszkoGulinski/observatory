// To run the simulator, use this command:
// npm run simulator /dev/pts/9
// where /dev/pts/9 is the serial port to use in the simulator (see README for instructions)

import { SerialPort } from "serialport";

const INTERVAL_MS = 5000;

const portName = process.argv[2];
console.log("Starting simulator");
console.log("Port name: ", portName);

try {
  const serialPort = new SerialPort({
    path: portName,
    baudRate: 115200,
  });

  setInterval(() => {
    serialPort.write("OPEN COND_OK TRACKING 450 -100 -15 65 127\n");
  }, INTERVAL_MS);
} catch (error) {
  console.error("Failed to open serial port", error);
  process.exit(1);
}
