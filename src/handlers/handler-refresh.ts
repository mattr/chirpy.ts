import type { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../utils/auth.js";
import { getRefreshToken } from "../db/queries/refresh-tokens.js";
import BadRequestError from "../errors/bad-request-error.js";

export default async function handlerRefresh(req: Request, res: Response) {
  const tokenStr = getBearerToken(req);
  if (!tokenStr) {
    throw new BadRequestError("No refresh token provided");
  }

  const refreshToken = await getRefreshToken(tokenStr);

  if (!refreshToken || refreshToken.expiresAt <= new Date() || refreshToken.revokedAt) {
    res.status(401).json({ error: "invalid token" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("jwt secret not set");
  }

  const token = makeJWT(refreshToken.userId);
  console.log("new token", token);
  res.status(200).json({ token })
}
