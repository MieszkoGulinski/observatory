import BackgroundCells from "./BackgroundCells";
import ObservationCell from "./ObservationCell";

function SingleDaySchedule() {
  return (
    <div className="flex flex-col grow">
      <div>2026-06-10</div>
      <div className="flex grow">
        {/* Hours column */}
        <div className="flex flex-col justify-between">
          <div>12</div>
          <div>0</div>
          <div>12</div>
        </div>

        {/* Time cells grid */}
        <div className="grow flex flex-col relative">
          <BackgroundCells />
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
