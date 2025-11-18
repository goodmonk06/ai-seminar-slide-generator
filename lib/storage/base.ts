/**
 * Base storage utilities for file-based persistence
 * Provides common functionality for all entity storage modules
 */

import fs from "fs/promises";
import path from "path";

export const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Ensure data directory and subdirectories exist
 */
export async function ensureDataDir(subdirectory?: string): Promise<string> {
  const dir = subdirectory ? path.join(DATA_DIR, subdirectory) : DATA_DIR;

  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  return dir;
}

/**
 * Read all JSON files from a directory
 */
export async function readAllFromDir<T>(
  subdirectory: string
): Promise<T[]> {
  try {
    const dir = await ensureDataDir(subdirectory);
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(dir, file), "utf-8");
        return JSON.parse(content);
      })
    );

    return items;
  } catch {
    return [];
  }
}

/**
 * Read a single JSON file
 */
export async function readOne<T>(
  subdirectory: string,
  id: string
): Promise<T | null> {
  try {
    const dir = await ensureDataDir(subdirectory);
    const filePath = path.join(dir, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Write a JSON file
 */
export async function writeOne<T>(
  subdirectory: string,
  id: string,
  data: T
): Promise<void> {
  const dir = await ensureDataDir(subdirectory);
  const filePath = path.join(dir, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Delete a JSON file
 */
export async function deleteOne(
  subdirectory: string,
  id: string
): Promise<boolean> {
  try {
    const dir = await ensureDataDir(subdirectory);
    const filePath = path.join(dir, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a unique ID with prefix
 */
export function generateId(prefix: string = "item"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Parse dates in JSON objects
 */
export function parseDates<T>(
  obj: T,
  dateFields: string[]
): T {
  const parsed = { ...obj } as any;
  for (const field of dateFields) {
    if (parsed[field] && typeof parsed[field] === "string") {
      parsed[field] = new Date(parsed[field] as string);
    }
  }
  return parsed as T;
}
