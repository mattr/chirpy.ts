import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  db: { url: string, migrationConfig: MigrationConfig };
  platform: string
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations"
}

const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: process.env.DB_URL || "",
    migrationConfig
  },
  platform: process.env.PLATFORM || "production"
};

export default config;