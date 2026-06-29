import { useConfig } from "@/config";
import { getSunLevelsForDay } from "@/calculations/getSunLevelsForDay";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const backgroundByLevel = [
  "#dddddd", // sunrise / sunset
  "#aaaaaa", // civil twilight
  "#666666", // nautical twilight
  "#000000", // astronomical twilight
];

type BackgroundCellsProps = {
  startOfDay: number;
};

/**
 * Displays background gradient (civil, nautical, astronomical twilight and night) for a specified day.
 */
function BackgroundCells({ startOfDay }: BackgroundCellsProps) {
  const config = useConfig();
  const date = dayjs.utc(startOfDay).toDate();

  const blocksByLevel = getSunLevelsForDay(
    date,
    config.latitude,
    config.longitude,
  );

  const allBlocks = blocksByLevel.flatMap((blocks, level) => {
    // Draw blocks from lowest level (sunrise/sunset) to highest (astronomical twilight)

    return blocks.map((block, i) => {
      const [start, end] = block;
      return (
        <div
          key={`${level}-${i}`}
          className="absolute w-full"
          style={{
            top: `${start * 100}%`,
            bottom: `${(1 - end) * 100}%`,
            backgroundColor: backgroundByLevel[level],
          }}
        />
      );
    });
  });

  return <>{allBlocks}</>;
}

export default BackgroundCells;
