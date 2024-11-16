import postgres from "postgres";
import {
  drizzle as RemoteDrizzle,
  drizzle as LocalDrizzle,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const driver = postgres(process.env.DATABASE_URL as string);

let db: PostgresJsDatabase<typeof schema> | null = null;

if (process.env.NODE_ENV === "production") {
  db = RemoteDrizzle({ client: driver, schema });
} else {
  const migrationClient = postgres(process.env.DATABASE_URL as string);
  db = LocalDrizzle(migrationClient);
}

export { db };
