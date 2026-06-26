import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetcher } from "@/utils";
import useSWR from "swr";

type VarTypeCount = {
  normalizedVarType: string;
  count: number;
};

// TODO add clickable rows to apply filter on star catalog

function TypeStatistics() {
  const {
    data: varTypes,
    isLoading,
    error,
  } = useSWR<VarTypeCount[]>("/varTypes", fetcher);

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
                  <th>Type</th>
                  <th className="w-[80px]">Count</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {varTypes.map((varType) => (
                  <tr key={varType.normalizedVarType}>
                    <td>{varType.normalizedVarType}</td>
                    <td>{varType.count}</td>
                    <td>{/* TODO add description of varType */}</td>
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
