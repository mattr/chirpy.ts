import express, { NextFunction, Request, Response } from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import config from "./config.js";
import {
  handlerValidateChirp,
  handlerMetrics,
  handlerMetricsReset,
  handlerReadiness,
  handlerCreateUser,
  handlerCreateChirp
} from "./handlers/index.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./middleware/index.js";

process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 8080;

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handlerValidateChirp(req, res);
  } catch (err) {
    next(err);
  }
});
app.post("/api/users", handlerCreateUser);
app.post("/api/chirps", handlerCreateChirp);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);

// register error handlers at the end of all routes...?
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
