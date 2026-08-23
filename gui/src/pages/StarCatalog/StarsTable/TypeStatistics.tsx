import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import normalizedVarTypeDescriptions from "./normalizedVarTypeDescriptions";

type VarTypeCount = {
  normalizedVarType: string;
  count: number;
};

type TypeStatisticsProps = {
  onTypeClick?: (normalizedVarType: string) => void;
  onDeselectAll?: () => void;
  selectedTypes: string[];
};

function TypeStatistics({
  onTypeClick,
  onDeselectAll,
  selectedTypes,
}: TypeStatisticsProps) {
  const {
    data: varTypes,
    isLoading,
    error,
  } = useSWRImmutable<VarTypeCount[]>("/varTypes", fetcher);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show types</Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-xl">
        <DialogHeader>
          <DialogTitle>Types statistics and filter</DialogTitle>
        </DialogHeader>
        {isLoading ? <>loading...</> : null}
        {error ? <>error</> : null}
        {varTypes ? (
          <div className="max-h-100 overflow-y-scroll">
            <table className="table-fixed w-full">
              <thead className="sticky top-0 bg-card text-left">
                <tr>
                  <th className="w-[80px]"></th>
                  <th className="w-[80px]">Type</th>
                  <th className="w-[80px]">Count</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {varTypes.map((varType) => (
                  <tr
                    key={varType.normalizedVarType}
                    onClick={() => onTypeClick?.(varType.normalizedVarType)}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    <td>
                      <input
                        type="checkbox"
                        readOnly
                        checked={selectedTypes.includes(
                          varType.normalizedVarType,
                        )}
                      />
                    </td>
                    <td>{varType.normalizedVarType}</td>
                    <td>{varType.count}</td>
                    <td>
                      {normalizedVarTypeDescriptions[
                        varType.normalizedVarType
                      ] || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button onClick={onDeselectAll}>Deselect all</Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TypeStatistics;
