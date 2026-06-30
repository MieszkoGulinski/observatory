export type ObservationCellProps = {
  normalizedStart: number;
  normalizedEnd: number;
};

// Bar showing time where there is an observation

function ObservationTimeCell({
  normalizedStart,
  normalizedEnd,
}: ObservationCellProps) {
  const startPerc = normalizedStart * 100;
  const endPerc = normalizedEnd * 100;

  return (
    <div
      className="absolute border border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer text-xs"
      style={{
        top: startPerc + "%",
        height: endPerc - startPerc + "%",
        left: "10px",
        right: "10px",
      }}
    />
  );
}

export default ObservationTimeCell;
