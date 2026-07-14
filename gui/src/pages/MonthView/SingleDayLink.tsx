import { Link } from "react-router";

type SingleDayLinkProps = {
  day: string;
  status: string;
};

function SingleDayLink({ day, status }: SingleDayLinkProps) {
  return (
    <tr>
      <td>
        <Link to={`/night/${day}`}>{day}</Link>
      </td>
      <td>{status}</td>
    </tr>
  );
}

export default SingleDayLink;
