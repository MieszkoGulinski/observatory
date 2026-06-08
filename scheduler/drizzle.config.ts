import { defineConfig } from "drizzle-kit";
import config from "./src/config.ts";
import path from "node:path";

const dbPath = path.join(config.filesPath, "observatory.sqlite");

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
  schema: "./src/db/schema.ts",
  strict: true,
});
