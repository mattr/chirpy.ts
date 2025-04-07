import express, { Request, Response } from 'express';
import middlewareLogResponses from "./middleware/middleware-log-responses.js";
import config from "./config.js";
import middlewareMetricsInc from "./middleware/middleware-metrics-inc.js";

const app = express();
const PORT = 8080;


app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.get("/admin/reset", handlerResetMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK")
}

function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
<html lang="en">
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>
`);
}

function handlerResetMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  config.fileserverHits = 0;
  res.send("OK")
}