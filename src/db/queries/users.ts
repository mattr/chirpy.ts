import { db } from "../index.js";
import { NewUser, User, UserResponse, users } from "../../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  return result as UserResponse;
}

export async function GetUserByEmail(email: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result as User;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function updateUser(userId: string, user: NewUser): Promise<UserResponse> {
  const [result] = await db.update(users).set({...user}).where(eq(users.id, userId)).returning();
  return result as UserResponse;
}

export async function upgradeUser(userId: string) {
  const [result] = await db.update(users).set({ isChirpyRed: true }).where(eq(users.id, userId)).returning();
  return result as UserResponse;
}
