## How time is handled?

In the Node.js code for running the scheduler, the only thing we calculate is whether it's day (Sun above horizon) or night (Sun below horizon). For this, we use the [`suncalc` library](https://www.npmjs.com/package/suncalc).

In the GUI, a single **night** is a scheduling cycle starting and ending at noon (12:00) in the time zone set in the configuration (env var `SCHEDULER_TIME_ZONE`). Usually a night spans 24 hours, but it may be 23 or 25 hours on the nights of daylight saving time changes. A single night is identified by the date of the start of the night (noon of that day).

The time zone should be set to the observatory's local time zone. It affects only division of time into nights.
