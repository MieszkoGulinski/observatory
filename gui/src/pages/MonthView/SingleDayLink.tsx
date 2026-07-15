import { useConfig } from "@/config";
import dayjs from "dayjs";
import { Link } from "react-router";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cn } from "@/lib/utils";
import getNightStartEndStatus, {
  cssClassByStatus,
} from "@/calculations/getNightStartEndStatus";

dayjs.extend(timezone);
dayjs.extend(utc);

type SingleDayLinkProps = {
  day: string;
};

function SingleDayLink({ day }: SingleDayLinkProps) {
  const { schedulerTimeZone } = useConfig();

  const [_startTimestamp, _endTimestamp, status] = getNightStartEndStatus(
    day,
    schedulerTimeZone,
  );

  // Possibly in the future, add:
  // - How many observations were done this night
  // - Colorful bar showing the Sun altitude below (or above) horizon

  return (
    <tr
      className={cn(cssClassByStatus[status], "hover:bg-muted cursor-pointer")}
    >
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
