import { refreshTokens } from "../../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export async function createRefreshToken(token: string, userId: string) {
  const expiresAt = new Date(Date.now() + SIXTY_DAYS_MS);
  const [result] = await db.insert(refreshTokens).values({ token, userId, expiresAt }).returning();
  return result;
}

export async function deleteAllRefreshTokens() {
  return db.delete(refreshTokens);
}

export async function getRefreshToken(token: string) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return result;
}
