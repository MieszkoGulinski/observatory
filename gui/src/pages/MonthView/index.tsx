import { Calendar } from "@/components/ui/calendar";
import Layout from "@/Layout";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router";
import CurrentStatusSection from "./CurrentStatusSection";
import SingleDayLink from "./SingleDayLink";
import { useConfig } from "@/config";

function MonthView() {
  const navigate = useNavigate();
  const config = useConfig();

  // This is only used to generate days of month in calendar, so it can use browser's timezone.
  const [month, setMonth] = useState<Date>(new Date());

  const monthStart = dayjs(month).startOf("month");
  const daysInSelectedMonth = Array.from({ length: 31 }, (_, offset) =>
    monthStart.add(offset, "day").format("YYYY-MM-DD"),
  );

  // Idea: instead have 2 columns, one with days, one with calendar+status

  return (
    <Layout>
      <div className="flex justify-between">
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={(d) => {
            if (!d) return;
            // TODO check edge cases with time zones
            const day = dayjs(d).format("YYYY-MM-DD");
            navigate(`/night/${day}`);
          }}
          className="rounded-lg border"
          month={month}
          onMonthChange={setMonth}
          timeZone={config.schedulerTimeZone}
        />
        <CurrentStatusSection />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th className="pl-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {daysInSelectedMonth.map((day) => (
            <SingleDayLink key={day} day={day} />
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default MonthView;
