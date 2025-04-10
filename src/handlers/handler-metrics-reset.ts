import { Request, Response } from "express";
import config from "../config.js";
import ForbiddenError from "../errors/forbidden-error.js";
import { deleteAllUsers } from "../db/queries/users.js";

export default async function handlerMetricsReset(req: Request, res: Response) {
  if (config.platform != "dev") {
    throw new ForbiddenError("Reset function is only available in development");
  }

  res.set("Content-Type", "text/plain; charset=utf-8");
  config.fileserverHits = 0;
  await deleteAllUsers();
  res.send("OK")
}

