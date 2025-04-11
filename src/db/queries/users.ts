import { db } from "../index.js";
import { NewUser, UserResponse, users } from "../../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
  return result as UserResponse;
}

export async function GetUserByEmail(email: string): Promise<NewUser> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result as NewUser;
}

export async function deleteAllUsers() {
  await db.delete(users);
}