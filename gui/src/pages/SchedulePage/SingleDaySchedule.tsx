import BackgroundCells from "./BackgroundCells";
import ObservationCell from "./ObservationCell";
import dayjs from "dayjs";

type SingleDayScheduleProps = {
  date: Date;
};

/**
 * Displays a single day of observation schedule
 *
 * Note that the used convention treats midnight UTC as start/end of day,
 * and the timeline spans hours from 0 to 24 hours. So, observations will be displayed
 * close to start of the day (after midnight) and close to end of the day (before midnight).
 */

function SingleDaySchedule({ date }: SingleDayScheduleProps) {
  const dateStr = dayjs(date).format("YYYY-MM-DD (ddd)");

  return (
    <div className="flex flex-col grow">
      <div className="pl-5">{dateStr}</div>
      <div className="flex grow">
        {/* Hours column */}
        <div className="flex flex-col justify-between w-5 pr-1 text-right">
          <div>0</div>
          <div>12</div>
          <div>24</div>
        </div>

        {/* Time cells grid */}
        <div className="grow flex flex-col relative">
          <BackgroundCells date={date} />
          <ObservationCell label="RR Lyrae" startPerc={35} endPerc={50} />
          <ObservationCell label="Mu Cephei" startPerc={50} endPerc={52} />
          <ObservationCell label="P Cygni" startPerc={52} endPerc={54} />
          <ObservationCell label="Rho Cassiopeae" startPerc={54} endPerc={56} />
          <ObservationCell label="Zeta Geminorum" startPerc={56} endPerc={66} />
        </div>
      </div>
    </div>
  );
}

export default SingleDaySchedule;
