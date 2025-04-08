import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://matt:@localhost:5432/chirpy?sslmode=disable",
  },
})