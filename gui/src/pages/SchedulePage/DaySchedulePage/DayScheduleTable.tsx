import { type ScheduleWithTargetStar } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type DayScheduleTableProps = {
  schedule: ScheduleWithTargetStar[];
};

function DayScheduleTable({ schedule }: DayScheduleTableProps) {
  // TODO adjust min width
  return (
    <div className="overflow-y-auto">
      <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
        <thead>
          <tr className="border-b">
            <th className="p-2">Time</th>
            <th className="p-2">Target</th>
            <th className="p-2">Note</th>
            <th className="p-2">RA</th>
            <th className="p-2">Dec</th>
            <th className="p-2">Exp Time</th>
            <th className="p-2">Exp ISO</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((s) => (
            <tr key={s.id} className="border-b hover:bg-slate-800/50">
              <td className="p-2 whitespace-nowrap">
                {dayjs.utc(s.startDate).format("HH:mm")} -{" "}
                {dayjs.utc(s.endDate).format("HH:mm")}
              </td>
              <td className="p-2">
                {s.targetStar ? s.targetStar.starName : s.label}
              </td>
              <td className="p-2">{s.note}</td>
              <td className="p-2">{s.ra.toFixed(4)}</td>
              <td className="p-2">{s.dec.toFixed(4)}</td>
              <td className="p-2">{s.expTimeMs} ms</td>
              <td className="p-2">{s.expIso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DayScheduleTable;
