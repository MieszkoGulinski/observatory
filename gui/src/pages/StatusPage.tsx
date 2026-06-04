import { fetcher } from "@/utils";
import { useEffect } from "react";
import useSWR from "swr";

function StatusPage() {
  useEffect(() => {
    console.log("displaying StatusPage");
  }, []);
  const { data, error, isLoading } = useSWR("/status", fetcher);

  if (isLoading) return <>Loading...</>;
  if (error) return <>Error</>;

  return <>{JSON.stringify(data, null, 2)}</>;
}

export default StatusPage;
