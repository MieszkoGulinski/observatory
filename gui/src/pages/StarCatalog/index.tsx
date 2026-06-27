import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import TypeStatistics from "./TypeStatistics";

type StarCatalogEntry = {
  id: number;
  starName: string;
  ra: number;
  dec: number;
  minVMag: number;
  maxVMag: number;
  periodDays: number | null;
  varType: string;
  normalizedVarType: string;
};

function StarCatalog() {
  // useSWRImmutable doesn't automatically refetch data
  const {
    data: stars,
    isLoading,
    error,
  } = useSWRImmutable<StarCatalogEntry[]>("/starCatalog", fetcher);

  return (
    <div>
      {isLoading ? <>loading...</> : null}
      {error ? <>error</> : null}
      <TypeStatistics />
      {stars ? (
        <table className="table-fixed w-full">
          <thead className="text-left">
            <tr>
              <th>Name</th>
              <th>RA</th>
              <th>Dec</th>
              <th>Min VMag</th>
              <th>Max VMag</th>
              <th>Period (days)</th>
              <th>Type</th>
              <th>Normalized Type</th>
            </tr>
          </thead>
          <tbody>
            {stars.map((star) => (
              <tr key={star.id}>
                <td>{star.starName}</td>
                <td>{star.ra.toFixed(4)}</td>
                <td>{star.dec.toFixed(4)}</td>
                <td>{star.minVMag.toFixed(2)}</td>
                <td>{star.maxVMag.toFixed(2)}</td>
                <td>{star.periodDays?.toFixed(2) ?? "N/A"}</td>
                <td>{star.varType}</td>
                <td>{star.normalizedVarType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default StarCatalog;
