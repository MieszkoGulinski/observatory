import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import type { StarCatalogEntry } from "./types";
import StarsTable from "./StarsTable";
import SpinnerLine from "@/components/SpinnerLine";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import Layout from "@/Layout";

function StarCatalog() {
  // useSWRImmutable doesn't automatically refetch data
  const {
    data: stars,
    isLoading,
    error,
  } = useSWRImmutable<StarCatalogEntry[]>("/starCatalog", fetcher);

  return (
    <Layout>
      {isLoading ? <SpinnerLine /> : null}
      {error ? <ApiErrorMessage error={error} /> : null}
      {stars ? <StarsTable stars={stars} /> : null}
    </Layout>
  );
}

export default StarCatalog;
