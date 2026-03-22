import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "[Database] POSTGRES_URL environment variable is not defined. " +
      "Please set it in your environment variables."
  );
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Re-export schema
export * from "./schema";
