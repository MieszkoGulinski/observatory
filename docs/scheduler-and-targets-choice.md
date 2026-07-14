# Target selection algorithm

Instead of manually picking targets, which would be extremely time consuming (there are thousands of variable stars in the catalog, already filtered by magnitude and declination), the scheduler should be able to **automatically** select the targets and schedule observations.

Assuming that:

- a given night lasts for 12 hours on average
- a single observation takes 3 minutes on average (telescope movement + 2-3 exposures per star, 60 s each)

there are 240 observation slots in a night. This is only an approximation, as depending on star magnitude, the exposure time will be different.

Scheduling algorithm should attempt to minimize movement in the RA axis, as the movement is much slower than in DEC axis, because the RA axis has much larger gear ratio, as it needs to track Earth's rotation, while the DEC axis needs only to point at the star with accuracy only several times better than the field of view.

The algorithm cannot take into account cloud coverage and downtime due to precipitation (rain/snow), so the actual number of observations may be lower.

The algorithms can be modified, or their parameters adjusted, depending on the observer's particular interests or needs.

## Definitions

- Atmospheric extinction - dimming of light from a celestial object due to absorption and scattering by the Earth's atmosphere
- Cadence - required period between two consecutive observations of a given star
- Culmination - time when a star reaches its highest altitude above horizon

## Algorithm prioritizing long period variables

The initial version of the algorithm will search for variable stars with cadence of once per night or even less frequently, attempting to minimize the movement in the RA axis, and observe the stars closest to their culmination, as this will decrease errors due to atmospheric extinction.

The algorithm is as follows:

1. Filter stars where the period is longer than 20 days
2. For each of these stars, calculate the time of culmination
3. Sort stars by their culmination time
4. Schedule observations in order of culmination time, so that they are closest to the meridian and movement in the RA axis is minimized

If there are more stars than possible to observe a given night, the algorithm should limit the count of stars by discarding stars that:

- have low altitude
- are too bright or too dim - this is particularly important during summer, when the sky glow is higher
- have low amplitude
- are close to the Moon, although this requires significant additional calculations

## Algorithm including unknown period variables

The algorithm includes stars whose variability class is unknown, but are candidates for being variable stars. These stars are marked as `?` in the `normalizedVarType` column in the catalog.

The modification to the algorithm described above is that in the first step, we select stars whose period is above the specified threshold or belonging to the unknown variability class. When limiting stars to fill available time, we prioritize unknown variables over stars with known periods.

## Algorithm including short period pulsating variables

## Algorithm including eclipsing variables

Eclipsing variables need to be observed continuously to precisely catch the eclipse moment, so they should be scheduled in blocks of time containing sequential exposures, rather than as single observations.

## Insertion of flat calibration frames

Flat frames should be inserted into the observation schedule close to the twilight (both dawn and dusk), when the sky glow is still high, and the frame is evenly illuminated. The camera should be pointing towards the zenith. It's possible to calculate the RA and DEC of the zenith knowing the observer's latitude and time.

## Insertion of dark and bias calibration frames

Dark calibration frames are taken with no light coming into the camera, so they require the camera lens to be covered. This needs to be done manually during maintenance nights. The observer, knowing that a given night will be used for maintenance, should schedule dark frames to be taken instead of science frames.

While in theory dark frames could be taken at any time, it's safer to take them during night, to reduce possible interference from stray light.

Bias frames are also taken with no light coming into the camera, but they are taken with exposure time set to minimal possible value. Conditions should be exactly the same as during the exposure of dark frames. Bias frames are indicated by `expTimeMs` equal to 0 in the observation schedule. Even with that, exposure will take several seconds, as each frame needs to be downloaded from the camera buffer to the computer's disk.

Dark calibration frames at various exposure times can be taken by providing multiple exposure times in the `observations_schedule` table. As each schedule item has identical coordinates, the exposures will be taken one after another without movement of the telescope other than standard tracking movement.

Example `expTimeMs` value in `observations_schedule` for dark frames:

```
0,1000,0,2000,0,5000,0,10000,0,20000,0,30000,0,45000,0,60000
```

This will take dark frames with exposure times 1 s, 2 s, ... interleaved with bias frames. Then, set `startDate` and `endDate` to cover the entire night. The camera will keep taking images with the provided exposure times in a loop until `endDate` is reached.
