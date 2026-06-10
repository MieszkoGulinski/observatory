import BackgroundCells from "./BackgroundCells";

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
        <div className="grow flex flex-col">
          <BackgroundCells />
        </div>
      </div>
    </div>
  );
}

export default SingleDaySchedule;
