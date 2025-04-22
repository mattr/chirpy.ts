import { db } from "../index.js";
import { chirps, NewChirp } from "../../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
  return result;
}

export async function getAllChirps() {
  return db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirpById(id: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export async function deleteAllChirps() {
  await db.delete(chirps);
}

export async function deleteChirp(chirpId: string) {
  const [result] = await db.delete(chirps).where(eq(chirps.id, chirpId)).returning();
  return result;
}
