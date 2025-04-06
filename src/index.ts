import express, { Request, Response } from 'express';
import path from 'path';
import middlewareLogResponses from "./middleware/middleware-log-responses.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static('./src/app'));

app.get("/healthz", handlerReadiness)

app.use(middlewareLogResponses)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK")
}