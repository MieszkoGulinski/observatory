export type ObservationCellProps = {
  label: string;
  startPerc: number;
  endPerc: number;
};

// probably just should accept schedule item as props, TODO change later

function ObservationCell({ label, startPerc, endPerc }: ObservationCellProps) {
  return (
    <div
      className="absolute border border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer text-xs"
      style={{
        top: startPerc + "%",
        height: endPerc - startPerc + "%",
        left: "10px",
        right: "10px",
      }}
    >
      {label}
    </div>
  );
}

export default ObservationCell;
