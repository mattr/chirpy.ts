import type { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../utils/auth.js";
import { getRefreshToken } from "../db/queries/refresh-tokens.js";

const SIXTY_MINUTES_MS = 60 * 60 * 1000;

export default async function handlerRefresh(req: Request, res: Response) {
  const tokenStr = getBearerToken(req);
  if (!tokenStr) {
    throw new Error("No token provided");
  }

  const refreshToken = await getRefreshToken(tokenStr);

  if (!refreshToken || refreshToken.expiresAt <= new Date()) {
    res.status(401).json({ error: "invalid token" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("jwt secret not set");
  }

  const token = makeJWT(refreshToken.userId, SIXTY_MINUTES_MS, secret);
  res.status(200).json({ token })
}
