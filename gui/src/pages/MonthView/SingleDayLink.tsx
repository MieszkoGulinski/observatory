import { useConfig } from "@/config";
import dayjs from "dayjs";
import { Link } from "react-router";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cn } from "@/lib/utils";

dayjs.extend(timezone);
dayjs.extend(utc);

type SingleDayLinkProps = {
  day: string;
};

function SingleDayLink({ day }: SingleDayLinkProps) {
  const { schedulerTimeZone } = useConfig();

  const startTimestamp = dayjs(day)
    .tz(schedulerTimeZone)
    .startOf("day")
    .add(12, "hour");
  const endTimestamp = dayjs(startTimestamp)
    .tz(schedulerTimeZone)
    .add(1, "day");

  let status: string;
  let cssClass: string;

  if (Date.now() < startTimestamp.valueOf()) {
    status = "Upcoming";
    cssClass = "";
  } else if (Date.now() > endTimestamp.valueOf()) {
    status = "Past";
    cssClass = "text-gray-500";
  } else {
    status = "Active";
    cssClass = "font-semibold";
  }

  // Possibly in the future, add:
  // - How many observations were done this night
  // - Colorful bar showing the Sun altitude below (or above) horizon

  return (
    <tr className={cn(cssClass, "hover:bg-muted cursor-pointer")}>
      <td>
        <Link to={`/night/${day}`}>{day}</Link>
      </td>
      <td className="pl-2">
        <Link to={`/night/${day}`}>{status}</Link>
      </td>
    </tr>
  );
}

export default SingleDayLink;
