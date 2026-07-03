import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import normalizedVarTypeDescriptions from "./normalizedVarTypeDescriptions";
import { cn } from "@/lib/utils";

type VarTypeCount = {
  normalizedVarType: string;
  count: number;
};

type TypeStatisticsProps = {
  onTypeClick?: (normalizedVarType: string) => void;
  selectedTypes: string[];
};

function TypeStatistics({ onTypeClick, selectedTypes }: TypeStatisticsProps) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Types statistics</DialogTitle>
        </DialogHeader>
        {isLoading ? <>loading...</> : null}
        {error ? <>error</> : null}
        {varTypes ? (
          <div className="max-h-100 overflow-y-scroll">
            <table className="table-fixed w-full">
              <thead className="sticky top-0 bg-white text-left">
                <tr>
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
                    className={cn(
                      "cursor-pointer hover:bg-gray-100",
                      selectedTypes.includes(varType.normalizedVarType)
                        ? "bg-gray-200 hover:bg-gray-300"
                        : "",
                    )}
                  >
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
      </DialogContent>
    </Dialog>
  );
}

export default TypeStatistics;
