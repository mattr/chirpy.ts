import express, { Request, Response } from 'express';
import middlewareLogResponses from "./middleware/middleware-log-responses.js";
import config from "./config.js";
import middlewareMetricsInc from "./middleware/middleware-metrics-inc.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetMetrics);


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

function handlerValidateChirp(req: Request, res: Response) {
  type ChirpBody = { body: string };
  const MAX_CHIRP_LENGTH = 140;

  res.set("Content-Type", "application/json; charset=utf-8");

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body) as ChirpBody;
      if (parsedBody.body.length > MAX_CHIRP_LENGTH) {
        res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }));
        return;
      }
      res.status(200).send(JSON.stringify({ "valid": true }));
    } catch (error) {
      res.status(400).send(JSON.stringify({ "error": "Something went wrong" }))
    }
  })
}