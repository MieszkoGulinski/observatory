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

To setup the database:

```bash
npm run db:push
```

To run in development mode, using `tsx`:

```bash
npm run dev
```

Configuration via command line arguments must be done after `--` marker:

```bash
npm run dev -- --serialPort=/dev/ttyUSB1 --baudRate=115200 --logToFile --filesPath=/mnt/observatory-hdd
```

To build:

```bash
npm run build
```

To run the built production code, with settings:

```bash
node dist/index.js --serialPort=/dev/ttyUSB1 --baudRate=115200 --logToFile --filesPath=/mnt/observatory-hdd
```

Note that to run the scheduler GUI, it needs to be built first, using appropriate npm script in the `gui` folder.

## Environment variables

| Variable      | Description                                    | Default      |
| ------------- | ---------------------------------------------- | ------------ |
| `SERIAL_PORT` | Serial port to use                             | `/dev/ttyS4` |
| `BAUD_RATE`   | Serial port baud rate                          | 115200       |
| `LOG_TO_FILE` | Log to file                                    | false        |
| `FILES_PATH`  | Path to store log files, raw images, SQLite DB | `.`          |
| `HTTP_PORT`   | Port for the REST API                          | 8080         |
| `LATITUDE`    | Latitude of the observatory                    | 54           |
| `LONGITUDE`   | Longitude of the observatory                   | 18           |

## Testing using a simulator and virtual serial port

To setup the virtual serial port, use the following command in a separate terminal:

```
socat -d -d pty,raw,echo=0 pty,raw,echo=0
```

The command will return the names of the serial ports, e.g.:

```
2026/06/03 21:19:19 socat[272776] N PTY is /dev/pts/9
2026/06/03 21:19:19 socat[272776] N PTY is /dev/pts/10
2026/06/03 21:19:19 socat[272776] N starting data transfer loop with FDs [5,5] and [7,7]
```

One of these ports needs to be assigned to the scheduler, using the CLI argument `--serialPort`. Another port needs to be assigned to the simulator, passing it directly after the command (in another terminal), e.g.:

```
npm run simulator /dev/pts/9
```
