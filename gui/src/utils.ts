export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const fetcher = (path: string, args?: RequestInit) =>
  fetch(`${BASE_URL}${path}`, args).then((res: Response) => res.json());
