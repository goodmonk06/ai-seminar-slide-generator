/**
 * Storage layer for User entities
 */

import { User } from "../types";
import {
  readAllFromDir,
  readOne,
  writeOne,
  deleteOne,
  generateId,
  parseDates,
} from "./base";

const SUBDIRECTORY = "users";

/**
 * Save a user
 */
export async function saveUser(user: User): Promise<void> {
  await writeOne(SUBDIRECTORY, user.id, user);
}

/**
 * Get a user by ID
 */
export async function getUser(id: string): Promise<User | null> {
  const data = await readOne<User>(SUBDIRECTORY, id);
  if (!data) return null;

  return parseDates(data, ["createdAt", "updatedAt"]);
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const all = await getAllUsers();
  return all.find((u) => u.email === email) || null;
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const all = await readAllFromDir<User>(SUBDIRECTORY);
  return all
    .map((u) => parseDates(u, ["createdAt", "updatedAt"]))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User | null> {
  const existing = await getUser(id);
  if (!existing) return null;

  const updated: User = {
    ...existing,
    ...updates,
    id: existing.id,
    updatedAt: new Date(),
  };

  await saveUser(updated);
  return updated;
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  return await deleteOne(SUBDIRECTORY, id);
}

/**
 * Generate a new user ID
 */
export function generateUserId(): string {
  return generateId("user");
}
