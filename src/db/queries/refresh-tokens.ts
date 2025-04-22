import { refreshTokens } from "../../schema.js";
import { db } from "../index.js";

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export async function createRefreshToken(token: string, userId: string) {
  const expiresAt = new Date(Date.now() + SIXTY_DAYS_MS);
  const [result] = await db.insert(refreshTokens).values({ token, userId, expiresAt }).returning();
  return result;
}
