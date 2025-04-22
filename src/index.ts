import express, { NextFunction, Request, Response } from "express";
import postgres from 'postgres';
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import config from "./config.js";
import {
  handlerCreateChirp,
  handlerCreateUser,
  handlerDeleteChirp,
  handlerGetChirp,
  handlerGetChirps,
  handlerLogin,
  handlerMetrics,
  handlerMetricsReset,
  handlerPolkaWebhooks,
  handlerReadiness,
  handlerRefresh,
  handlerRevoke,
  handlerUpdateUser,
  handlerValidateChirp,
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
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefresh);
app.post("/api/revoke", handlerRevoke);
app.post("/api/users", handlerCreateUser);
app.put("/api/users", handlerUpdateUser);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:id", handlerGetChirp);
app.delete("/api/chirps/:id", handlerDeleteChirp);

app.post("/api/polka/webhooks", handlerPolkaWebhooks);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);

// register error handlers at the end of all routes...?
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
