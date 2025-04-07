import { Request, Response, NextFunction } from "express";
import config from "../config.js";

export default function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  // res.on("finish", () => {
  config.fileserverHits += 1;
  console.log(`[middlewareMetricsInc] ${config.fileserverHits}`);
  // });
  next();
}