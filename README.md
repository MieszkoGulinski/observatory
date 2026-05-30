# Autonomous variable stars observatory

As observing [variable stars](https://en.wikipedia.org/wiki/Variable_star) even by amateurs allows gathering scientifically useful data, I decided to build a [robotic telescope](https://en.wikipedia.org/wiki/Robotic_telescope) for this purpose, meaning that the telescope operates without continuous human attention. It's intended to be placed in a remote location far away from any city light pollution, that I can personally visit every several weeks to perform maintenance and program new observing tasks.

Operating the telescope involves the following steps:

1. Scheduling observations for the upcoming several weeks, based on the predicted positions of variable stars and visibility windows.
2. Executing the observation plan autonomously.
3. On the next visit to the observatory, downloading acquired data.
4. Processing collected data to obtain [light curves](https://en.wikipedia.org/wiki/Light_curve) and uploading them to [AAVSO](https://www.aavso.org/) database.

The codebase is organized into the following main components:

- Scheduler - written in JavaScript (running on Bun), providing a web UI, running on a Raspberry Pi
- Motor controller - written in C++ (Arduino)
- Processing pipeline - written in Python, running on a PC

## Scheduler

The scheduler is responsible for planning observations and executing them. It runs on a Raspberry Pi and provides a web UI for configuration and monitoring.

Scheduler has the following functionalities:

- Planning observations using a web UI
- Executing observations
- Monitoring status using a web UI
- Communication with the motor controller via serial port
- Downloading acquired data
