/**
 * Legacy storage module for SlidePlans
 * Maintained for backward compatibility
 * New code should use lib/storage/plans.ts instead
 */

import { SlidePlan, SlidePlanFilters, PaginatedResponse } from "./types";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PLANS_SUBDIR = path.join(DATA_DIR, "plans");

// データディレクトリの初期化
async function ensureDataDir() {
  try {
    await fs.access(PLANS_SUBDIR);
  } catch {
    await fs.mkdir(PLANS_SUBDIR, { recursive: true });
  }

  // Also ensure legacy data dir for backward compat
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// スライドプランを保存
export async function saveSlidePlan(plan: SlidePlan): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(PLANS_SUBDIR, `${plan.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(plan, null, 2), "utf-8");
}

// スライドプランを取得
export async function getSlidePlan(id: string): Promise<SlidePlan | null> {
  try {
    // Try new location first
    let filePath = path.join(PLANS_SUBDIR, `${id}.json`);
    let content: string;

    try {
      content = await fs.readFile(filePath, "utf-8");
    } catch {
      // Fall back to legacy location
      filePath = path.join(DATA_DIR, `${id}.json`);
      content = await fs.readFile(filePath, "utf-8");
    }

    const data = JSON.parse(content);

    // Parse dates and ensure all fields exist
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.createdAt),
      version: data.version || 1,
      tags: data.tags || [],
      metadata: data.metadata || {},
    };
  } catch {
    return null;
  }
}

// 全てのスライドプランを取得（ペジネーション対応）
export async function getAllSlidePlans(
  filters?: SlidePlanFilters
): Promise<PaginatedResponse<SlidePlan>> {
  try {
    await ensureDataDir();

    // Read from both locations
    const newFiles = await readFilesFromDir(PLANS_SUBDIR);
    const legacyFiles = await readFilesFromDir(DATA_DIR);

    const allPlans = [...newFiles, ...legacyFiles];

    const plans = allPlans.map((data) => ({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.createdAt),
      version: data.version || 1,
      tags: data.tags || [],
      metadata: data.metadata || {},
    }));

    // Apply filters
    let filtered = plans;

    if (filters?.userId) {
      filtered = filtered.filter((p) => p.userId === filters.userId);
    }

    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter((p) =>
        filters.tags!.some((tag) => p.tags?.includes(tag))
      );
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.audience.toLowerCase().includes(search) ||
          p.keywords?.toLowerCase().includes(search)
      );
    }

    if (filters?.minDuration) {
      filtered = filtered.filter((p) => p.durationMinutes >= filters.minDuration!);
    }

    if (filters?.maxDuration) {
      filtered = filtered.filter((p) => p.durationMinutes <= filters.maxDuration!);
    }

    // Sort
    const sortBy = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder || "desc";

    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof SlidePlan];
      const bVal = b[sortBy as keyof SlidePlan];

      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === "asc"
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);

    return {
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  } catch {
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

async function readFilesFromDir(dir: string): Promise<SlidePlan[]> {
  try {
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const plans = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const content = await fs.readFile(path.join(dir, file), "utf-8");
          return JSON.parse(content);
        } catch {
          return null;
        }
      })
    );

    return plans.filter((p): p is SlidePlan => p !== null);
  } catch {
    return [];
  }
}

// IDを生成
export function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Update a slide plan
export async function updateSlidePlan(
  id: string,
  updates: Partial<SlidePlan>
): Promise<SlidePlan | null> {
  const existing = await getSlidePlan(id);
  if (!existing) return null;

  const updated: SlidePlan = {
    ...existing,
    ...updates,
    id: existing.id,
    version: existing.version + 1,
    updatedAt: new Date(),
  };

  await saveSlidePlan(updated);
  return updated;
}

// Delete a slide plan
export async function deleteSlidePlan(id: string): Promise<boolean> {
  try {
    let filePath = path.join(PLANS_SUBDIR, `${id}.json`);
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      // Try legacy location
      filePath = path.join(DATA_DIR, `${id}.json`);
      await fs.unlink(filePath);
      return true;
    }
  } catch {
    return false;
  }
}
