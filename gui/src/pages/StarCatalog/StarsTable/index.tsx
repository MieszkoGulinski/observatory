import type { StarCatalogEntry, StarCatalogFilters } from "../types";
import TypeStatistics from "./TypeStatistics";
import { useCallback, useMemo, useState } from "react";
import { sortBy } from "ramda";
import TableHeader from "./TableHeader";
import StarDetailsModal from "./StarDetailsModal";

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
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const starsToDisplay = useMemo(
    () =>
      stars.filter((star) => {
        // Add more filters here
        if (filters.normalizedVarTypes.length === 0) return true;
        return filters.normalizedVarTypes.includes(star.normalizedVarType);
      }),
    [stars, filters],
  );

  const sortedStars = sortBy(
    (star) => star[orderBy] as number | string, // TypeScript wouldn't accept null
    starsToDisplay,
  );
  if (orderDesc) sortedStars.reverse();

  const onChangeOrder = useCallback((column: keyof StarCatalogEntry) => {
    setOrderBy(column);
    setOrderDesc((prev) => !prev);
  }, []);

  const onToggleNormalizedVarType = useCallback((normalizedVarType: string) => {
    setFilters((prevFilters) => {
      if (prevFilters.normalizedVarTypes.includes(normalizedVarType)) {
        return {
          normalizedVarTypes: prevFilters.normalizedVarTypes.filter(
            (t) => t !== normalizedVarType,
          ),
        };
      }
      return {
        normalizedVarTypes: [
          ...prevFilters.normalizedVarTypes,
          normalizedVarType,
        ],
      };
    });
  }, []);

  const onDeselectAll = useCallback(() => {
    setFilters({ normalizedVarTypes: [] });
  }, []);

  return (
    <>
      <div className="flex gap-2 items-center">
        <TypeStatistics
          onTypeClick={onToggleNormalizedVarType}
          onDeselectAll={onDeselectAll}
          selectedTypes={filters.normalizedVarTypes}
        />
        <div>
          {filters.normalizedVarTypes.length > 0 ? "Selected: " : ""}
          {filters.normalizedVarTypes.join(" ")}
        </div>
        <div>Total displayed: {sortedStars.length}</div>
      </div>
      <table className="table-fixed w-full">
        <TableHeader
          onChangeOrder={onChangeOrder}
          orderBy={orderBy}
          orderDesc={orderDesc}
        />
        <tbody>
          {sortedStars.map((star) => (
            <tr
              key={star.id}
              className="hover:bg-secondary"
              onClick={() => setSelectedStar(star.id)}
            >
              <td>{star.starName}</td>
              <td>{star.ra.toFixed(4)}</td>
              <td>{star.dec.toFixed(4)}</td>
              <td>{star.minVMag.toFixed(2)}</td>
              <td>{star.maxVMag.toFixed(2)}</td>
              <td>
                {star.periodDays?.toFixed(2) ?? (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </td>
              <td>{star.varType}</td>
              <td>{star.normalizedVarType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedStar !== null ? (
        <StarDetailsModal
          star={stars.find((star) => star.id === selectedStar)!}
          onClose={() => setSelectedStar(null)}
        />
      ) : null}
    </>
  );
}

export default StarsTable;
