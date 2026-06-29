import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { BASE_URL } from "@/utils";

function ApiErrorMessage({ error }: { error: unknown }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <p>
          Failed to load data:
          <br />
          {error instanceof Error ? error.message : String(error)}
        </p>
        <p>
          Make sure that the backend is running at the appropriate URL:
          <br />
          {BASE_URL}
        </p>
      </AlertDescription>
    </Alert>
  );
}

export default ApiErrorMessage;
