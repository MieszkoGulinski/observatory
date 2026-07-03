import type { StarCatalogEntry, StarCatalogFilters } from "./types";
import TypeStatistics from "./TypeStatistics";
import { useState } from "react";
import { sortBy } from "ramda";

type StarsTableProps = {
  stars: StarCatalogEntry[];
};

const defaultFilters: StarCatalogFilters = {
  normalizedVarTypes: [], // display all types by default
};

function StarsTable({ stars }: StarsTableProps) {
  const [filters, setFilters] = useState<StarCatalogFilters>(defaultFilters);
  const [orderBy, setOrderBy] = useState<keyof StarCatalogEntry>("starName");
  const [orderDesc, setOrderDesc] = useState<boolean>(false);

  const starsToDisplay = stars.filter((star) => {
    // Add more filters here
    if (filters.normalizedVarTypes.length === 0) return true;
    return filters.normalizedVarTypes.includes(star.normalizedVarType);
  });

  const sortedStars: StarCatalogEntry[] = sortBy(
    (star: StarCatalogEntry) => star[orderBy],
    starsToDisplay,
  );
  if (orderDesc) sortedStars.reverse();

  function onChangeOrder(column: keyof StarCatalogEntry) {
    setOrderBy(column);
    setOrderDesc(!orderDesc);
  }

  return (
    <>
      <TypeStatistics
        onTypeClick={(normalizedVarType) => {
          // Set filter to display only a single normalizedVarType
          setFilters({ normalizedVarTypes: [normalizedVarType] });
        }}
      />
      <table className="table-fixed w-full">
        <thead className="text-left">
          <tr>
            <th onClick={() => onChangeOrder("starName")}>Name</th>
            <th onClick={() => onChangeOrder("ra")}>RA</th>
            <th onClick={() => onChangeOrder("dec")}>Dec</th>
            <th onClick={() => onChangeOrder("minVMag")}>Min VMag</th>
            <th onClick={() => onChangeOrder("maxVMag")}>Max VMag</th>
            <th onClick={() => onChangeOrder("periodDays")}>Period (days)</th>
            <th>Type</th>
            <th>Normalized Type</th>
          </tr>
        </thead>
        <tbody>
          {sortedStars.map((star) => (
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
    </>
  );
}

export default StarsTable;
