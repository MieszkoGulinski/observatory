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

To load the star catalog from a CSV file:

```bash
npm run load-catalog ../aavso-up-to-mag-10.csv
```

Note that:

- the import script applies max magnitude and min amplitude filters, and these filters are hardcoded in the script
- declination filters are read from environment variables `MIN_DECLINATION` and `MAX_DECLINATION`
- the provided CSV file is exported from AAVSO VSX website, attempting to include all stars brighter than mag 10, but apparently the filter was unreliable, as there were more ones found

To run in development mode, using `tsx`:

```bash
npm run dev
```

Configuration can be done using the `.env` file or command line arguments.

To build:

```bash
npm run build
```

To run the built production code:

```bash
node dist/index.js
```

Note that to run the scheduler GUI, it needs to be built first, using appropriate npm script in the `gui` folder.

## Environment variables

| Variable                 | Description                                    | Default      |
| ------------------------ | ---------------------------------------------- | ------------ |
| `SERIAL_PORT`            | Serial port to use                             | `/dev/ttyS4` |
| `BAUD_RATE`              | Serial port baud rate                          | 115200       |
| `LOG_TO_FILE`            | Log to file                                    | false        |
| `FILES_PATH`             | Path to store log files, raw images, SQLite DB | `.`          |
| `HTTP_PORT`              | Port for the REST API                          | 8080         |
| `LATITUDE`               | Latitude of the observatory                    | 54           |
| `LONGITUDE`              | Longitude of the observatory                   | 18           |
| `IMPORT_LIMIT_MAG`       | Maximum magnitude to import                    | 12           |
| `IMPORT_LIMIT_AMPLITUDE` | Minimum amplitude to import                    | 0.1          |
| `IMPORT_MIN_DECLINATION` | Minimum declination to import                  | -30          |
| `IMPORT_MAX_DECLINATION` | Maximum declination to import                  | None         |

`IMPORT_LIMIT_MAG`, `IMPORT_LIMIT_AMPLITUDE`, `IMPORT_MIN_DECLINATION` and `IMPORT_MAX_DECLINATION` are applied during running the import script.

If you're in the northern hemisphere, you'll probably need to set `IMPORT_MIN_DECLINATION` to a negative value, to prevent importing stars from the southern hemisphere that won't be visible from your location.

If you're in the southern hemisphere, you'll probably need to set `IMPORT_MAX_DECLINATION` to a positive value, to prevent importing stars from the northern hemisphere that won't be visible from your location.

`IMPORT_LIMIT_MAG` and `IMPORT_LIMIT_AMPLITUDE` allow additional filtering, and should be adjusted depending on your hardware and sky limitations.

## Testing using a simulator and virtual serial port

The most convenient way to test is to run the app and simulator together using `app-and-simulator` script:

```bash
npm run app-and-simulator
```

This script starts:

1. Virtual serial port using `socat`
2. Scheduler using the virtual serial port
3. Simulator using the virtual serial port

Note that it's necessary to have `socat` installed - on Debian/Ubuntu:

```bash
sudo apt install socat
```
