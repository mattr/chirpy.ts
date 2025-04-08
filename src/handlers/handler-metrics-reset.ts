import { Request, Response } from "express";
import config from "../config.js";

export default async function handlerMetricsReset(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  config.fileserverHits = 0;
  res.send("OK")
}

