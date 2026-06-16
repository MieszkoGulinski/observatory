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

function TypeStatistics() {
  const {
    data: varTypes,
    isLoading,
    error,
  } = useSWR<VarTypeCount[]>("/varTypes", fetcher);

  console.log(varTypes);

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
          <table className="table-fixed w-full max-h-100 overflow-y-scroll block">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th>Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {varTypes.map((varType) => (
                <tr key={varType.normalizedVarType}>
                  <td>{varType.normalizedVarType}</td>
                  <td>{varType.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default TypeStatistics;
