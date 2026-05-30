# Observation scheduler

Initially I tried to:

1. Write the scheduler in Python
2. Write the scheduler in TypeScript and use Bun as runtime, but apparently Bun is not yet compatible with the serial port library as of 1.3.14 version ([issue with serial port library](https://github.com/oven-sh/bun/issues/4622), [underlying issue](https://github.com/oven-sh/bun/issues/18546))

Finally I used Node.js with TypeScript. [Node.js can run TypeScript natively](https://nodejs.org/api/typescript.html) but it doesn't support all TypeScript features, so the code is built to JavaScript and then executed by Node.js.

## How to run

To install dependencies:

```bash
npm install
```

To run in development mode, using `tsx`:

```bash
npm run dev
```

Configuration via command line arguments must be done after `--` marker:

```bash
npm run dev -- --port=/dev/ttyUSB1 --baudRate=115200 --logToFile --filesPath=/mnt/observatory-hdd
```

To build:

```bash
npm run build
```

To run the built production code, with settings:

```bash
node dist/index.js --port=/dev/ttyUSB1 --baudRate=115200 --logToFile --filesPath=/mnt/observatory-hdd
```

Note that to run the scheduler GUI, it needs to be built first, using appropriate npm script in the `gui` folder.

## Command line arguments

| Argument      | Description                                    | Default      |
| ------------- | ---------------------------------------------- | ------------ |
| `--port`      | Serial port to use                             | `/dev/ttyS4` |
| `--baudRate`  | Serial port baud rate                          | 9600         |
| `--logToFile` | Log to file                                    | false        |
| `--filesPath` | Path to store log files, raw images, SQLite DB | `.`          |
