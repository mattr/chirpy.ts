import express, { NextFunction, Request, Response } from 'express';
import middlewareLogResponses from "./middleware/middleware-log-responses.js";
import middlewareMetricsInc from "./middleware/middleware-metrics-inc.js";
import errorHandler from "./middleware/error-handler.js";
import handlerValidateChirp from "./handlers/handler-validate-chirp.js";
import handlerMetrics from "./handlers/handler-metrics.js";
import handlerMetricsReset from "./handlers/handler-metrics-reset.js";
import handlerReadiness from "./handlers/handler-readiness.js";

const app = express();
const PORT = 8080;

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
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);

// register error handlers at the end of all routes...?
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
