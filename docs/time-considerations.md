## How time is handled?

In the Node.js code for running the scheduler, the only thing we calculate is whether it's day (Sun above horizon) or night (Sun below horizon). For this, we use the [`suncalc` library](https://www.npmjs.com/package/suncalc).

### Night = a scheduling cycle

In the GUI, a single **night** is a scheduling cycle starting and ending at noon in the time zone set in the configuration (env var `SCHEDULER_TIME_ZONE`). Usually a night spans 24 hours, but it may be 23 or 25 hours on the nights of daylight saving time changes.
