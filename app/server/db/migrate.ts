import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const runMigrations = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL as string, { max: 1 });
  const db = drizzle(migrationClient);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "drizzle/migrations" });

  console.log("Migrations complete!");

  await migrationClient.end();
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error("Migration failed!", err);
  process.exit(1);
});
