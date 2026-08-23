## Introduction

This selection algorithm is very simple and concentrates on stars with long periods, so that each star is observed only once in the night.

## Algorithm development

Version 1 of the scheduler will select stars in the following normalized types:

- Semiregular (S/SR/SRA/SRB/SRC/SRD/SRS)
- Long period variables (L/LB/LC)
- Mira (M)
- RV Tauri variables (RV/RVA/RVB)
- Unknown

and either known to have period of more than 20 days, or having unknown period.

```sql
SELECT COUNT(*) FROM star_catalog WHERE (periodDays IS NULL OR periodDays > 20) AND normalizedVarType IN ('S', 'SR', 'SRA', 'SRB', 'SRC', 'SRD', 'SRS', 'L', 'LB', 'LC', 'M', 'RV', 'RVA', 'RVB', '?');
```

This query returns 1169 stars.

But how many stars can we observe in one night? Let's suppose a single observation takes on average 3 minutes (taking into consideration targeting, exposure and download), and in each night we have 8 hours of observation time. This means that we can observe only 160 stars in one night.

The algorithm will attempt to schedule observation of a star close to its culmination time, meaning that at that time the altitude of the star will be largest. This minimizes errors due to atmospheric extinction.

8 hours is 1/3 of the day, so we can observe roughly 1/3 of the stars in the sky each night. 1/3 of 1169 is roughly 389 stars. We must adjust filters so that we get approximately 480 stars from all right ascensions.

How to select those stars to maximize the scientific gain? First idea would be to eliminate stars whose declination is too low:

```sql
SELECT COUNT(*) FROM star_catalog WHERE (periodDays IS NULL OR periodDays > 20) AND normalizedVarType IN ('S', 'SR', 'SRA', 'SRB', 'SRC', 'SRD', 'SRS', 'L', 'LB', 'LC', 'M', 'RV', 'RVA', 'RVB', '?') AND dec > 0;
```

737 stars remaining.

What else? Possibly, to avoid saturation of images, we should avoid very bright stars.

```sql
SELECT COUNT(*) FROM star_catalog WHERE (periodDays IS NULL OR periodDays > 20) AND normalizedVarType IN ('S', 'SR', 'SRA', 'SRB', 'SRC', 'SRD', 'SRS', 'L', 'LB', 'LC', 'M', 'RV', 'RVA', 'RVB', '?') AND dec > 0 AND minVMag > 5;
```

690 stars remaining.

What else? Try minimum amplitude:

```sql
SELECT COUNT(*) FROM star_catalog WHERE (periodDays IS NULL OR periodDays > 20) AND normalizedVarType IN ('S', 'SR', 'SRA', 'SRB', 'SRC', 'SRD', 'SRS', 'L', 'LB', 'LC', 'M', 'RV', 'RVA', 'RVB', '?') AND dec > 0 AND minVMag > 5 AND (maxVMag-minVMag) > 0.25;
```

By adjusting the amplitude threshold it was possible to select 481 stars. This is nearly equal to target of 480 stars.

## Summary of results

```sql
SELECT normalizedVarType, COUNT(*) FROM star_catalog WHERE (periodDays IS NULL OR periodDays > 20) AND normalizedVarType IN ('S', 'SR', 'SRA', 'SRB', 'SRC', 'SRD', 'SRS', 'L', 'LB', 'LC', 'M', 'RV', 'RVA', 'RVB', '?') AND dec > 0 AND minVMag > 5 AND (maxVMag-minVMag) > 0.25 GROUP BY normalizedVarType ORDER BY COUNT(*) DESC;
```

```
SRB|189
?|84
LB|59
SR|39
SRC|30
LC|29
SRS|13
SRA|13
SRD|12
L|4
RVA|3
S|2
M|2
RVB|1
RV|1
```
