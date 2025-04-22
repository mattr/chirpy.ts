import type { Request, Response } from "express";
import { getBearerToken } from "../utils/auth.js";
import { revokeToken } from "../db/queries/refresh-tokens.js";

export default async function handlerRevoke(req: Request, res: Response) {
  const tokenStr = getBearerToken(req);
  if (!tokenStr) {
    throw new Error("bearer token not present");
  }

  await revokeToken(tokenStr)
  res.status(204).send();
}
