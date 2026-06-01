## Message from scheduler to microcontroller

Words are separated by spaces and the message is terminated with a newline character.

Commands:

- `HEARTBEAT`: Heartbeat to check if the scheduler is alive
- `OPEN`: Open the roof
- `CLOSE`: Close the roof and stop tracking
- `GOTO lha dec`: Move the telescope to the specified Hour Angle and Declination
- `STOP`: Stop tracking

Local hour angle and declination are provided in multiples of 0.1 degrees. Negative values are allowed. Declination range: -90 to +90. Hour angle range: -180 to +180 (although in practice it will be limited by the horizon position).

Local hour angle (angle from the meridian plane) is calculated in the Node.js code, because the microcontroller does not have a real time clock.

Example:

```
GOTO 450 -100
```

meaning: Move the telescope to LHA=45 deg, and DEC=-10 deg, and start tracking.

When conditions are unfavorable for observation (rain/snow) the telescope will stop tracking, the roof should be closed and the microcontroller will ignore all commands, until the conditions are favorable again.

Also, when the microcontroller does not receive heartbeat for specified time (60 seconds), it will close the roof and stop tracking.

## Message from microcontroller to scheduler

Similarly to messages sent from scheduler to microcontroller, words are separated by spaces and the message is terminated with a newline character.

- First word indicates status of the roof, can be OPEN, OPENING, CLOSED, CLOSING
- Second word indicates if weather conditions are good for observation (no rain/snow), can be COND_OK or COND_BAD.
- Third word indicates tracking status, can be TRACKING (when pointing at the specified location), SETTING (during rotating towards the specified location) or IDLE.
- Next are current position of the mount, in the same format as in the GOTO command, current temperature in Celsius, humidity in percent and battery voltage in multiples of 0.1 V.

Example:

```
OPEN COND_OK TRACKING 450 -100 -15 65 127
```

meaning: roof open, weather conditions ok, tracking active, LHA=45 deg, DEC=-10 deg, temp = -15 deg C, humidity = 65%, battery = 12.7 V
