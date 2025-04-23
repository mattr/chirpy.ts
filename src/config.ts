import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  db: { url: string, migrationConfig: MigrationConfig };
  platform: string;
  jwtSecret: string | undefined;
  polkaApiKey: string | undefined
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
  platform: process.env.PLATFORM || "production",
  jwtSecret: process.env.JWT_SECRET,
  polkaApiKey: process.env.POLKA_KEY,
};

export default config;
