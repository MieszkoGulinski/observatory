import type { CSSProperties } from "react";

const backgroundCellStyling = [
  { backgroundColor: "#ffffff", borderColor: "#000000" },
  { backgroundColor: "#dddddd", borderColor: "#ff0000" },
  { backgroundColor: "#aaaaaa", borderColor: "#ff9900" },
  { backgroundColor: "#666666", borderColor: "#ffff00" },
  { backgroundColor: "#000000", borderColor: "#99ff00" },
];

// TODO calculate height based on sunrise/sunset/twilight times
function UpperCell({ style }: { style: CSSProperties }) {
  return <div className="border-t" style={{ ...style, height: "12.5%" }} />;
}
function LowerCell({ style }: { style: CSSProperties }) {
  return <div className="border-b" style={{ ...style, height: "12.5%" }} />;
}

function BackgroundCells() {
  return (
    <>
      <UpperCell style={backgroundCellStyling[0]} />
      <UpperCell style={backgroundCellStyling[1]} />
      <UpperCell style={backgroundCellStyling[2]} />
      <UpperCell style={backgroundCellStyling[3]} />
      <UpperCell style={backgroundCellStyling[4]} />
      {/* Midnight should be somewhere here */}
      <LowerCell style={backgroundCellStyling[4]} />
      <LowerCell style={backgroundCellStyling[3]} />
      <LowerCell style={backgroundCellStyling[2]} />
      <LowerCell style={backgroundCellStyling[1]} />
      <LowerCell style={backgroundCellStyling[0]} />
    </>
  );
}

export default BackgroundCells;
