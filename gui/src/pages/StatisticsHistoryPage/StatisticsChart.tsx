import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { type StatisticsRow } from "./types";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import dayjs from "dayjs";

type StatisticsChartProps = {
  data: StatisticsRow[];
  dataKey: keyof StatisticsRow;
  label: string;
  color: string;
};

function StatisticsChart({
  data,
  dataKey,
  label,
  color,
}: StatisticsChartProps) {
  const config = {
    [dataKey]: {
      label,
      color,
    },
  } as ChartConfig;

  return (
    <div>
      <h2 className="text-lg">{label}</h2>
      <ChartContainer config={config}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => dayjs(value).format("HH:mm:ss")}
          />
          <Line
            dataKey={dataKey}
            type="monotone"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default StatisticsChart;
