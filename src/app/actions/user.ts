import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { InsertUser } from "@/lib/db/schema/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function addUser(user: InsertUser) {
  try {
    const response = await db.insert(users).values(user).returning();
    console.log(`User with auth ID ${response[0].authId} added to database.`);
    return response;
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw new Error("Database error");
  }
}

export async function deleteUser(authId: string) {
  try {
    await db.delete(users).where(eq(users.authId, authId));
    console.log(`User with auth ID ${authId} deleted from database.`);
  } catch (error) {
    console.error("Error deleting user from database:", error);
    throw new Error("Database error");
  }
}

export async function updateUser(
  authId: string,
  updates: Partial<{
    email: string;
    username: string;
    imageUrl: string;
  }>
) {
  try {
    await db.update(users).set(updates).where(eq(users.authId, authId));
    console.log(`User with auth ID ${authId} updated in database.`);
  } catch (error) {
    console.error("Error updating user in database:", error);
    throw new Error("Database error");
  }
}

export async function getUserByAuthId(authId: string) {
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.authId, authId));

  return userList[0] || null;
}

export async function getCurrentUser() {
  const { userId: authId } = await auth();

  if (!authId) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.authId, authId));

  return user || null;
}
