/**
 * Storage layer for Presentation entities
 */

import {
  Presentation,
  PresentationFilters,
  PaginatedResponse,
  PresentationStatus,
} from "../types";
import {
  readAllFromDir,
  readOne,
  writeOne,
  deleteOne,
  generateId,
  parseDates,
} from "./base";

const SUBDIRECTORY = "presentations";

/**
 * Save a presentation
 */
export async function savePresentation(
  presentation: Presentation
): Promise<void> {
  await writeOne(SUBDIRECTORY, presentation.id, presentation);
}

/**
 * Get a presentation by ID
 */
export async function getPresentation(
  id: string
): Promise<Presentation | null> {
  const data = await readOne<Presentation>(SUBDIRECTORY, id);
  if (!data) return null;

  return parseDates(data, [
    "createdAt",
    "updatedAt",
    "scheduledAt",
    "deliveredAt",
  ]);
}

/**
 * Get all presentations with optional filtering and pagination
 */
export async function getAllPresentations(
  filters?: PresentationFilters
): Promise<PaginatedResponse<Presentation>> {
  const all = await readAllFromDir<Presentation>(SUBDIRECTORY);

  // Parse dates
  const presentations = all.map((p) =>
    parseDates(p, ["createdAt", "updatedAt", "scheduledAt", "deliveredAt"])
  );

  // Apply filters
  let filtered = presentations;

  if (filters?.userId) {
    filtered = filtered.filter((p) => p.userId === filters.userId);
  }

  if (filters?.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter(
      (p) =>
        p.scheduledAt &&
        p.scheduledAt >= new Date(filters.dateFrom!)
    );
  }

  if (filters?.dateTo) {
    filtered = filtered.filter(
      (p) =>
        p.scheduledAt &&
        p.scheduledAt <= new Date(filters.dateTo!)
    );
  }

  // Sort by scheduled date or created date
  const sortBy = filters?.sortBy || "scheduledAt";
  const sortOrder = filters?.sortOrder || "desc";

  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof Presentation];
    const bVal = b[sortBy as keyof Presentation];

    if (aVal instanceof Date && bVal instanceof Date) {
      return sortOrder === "asc"
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    // Fall back to createdAt
    return sortOrder === "asc"
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime();
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
}

/**
 * Update a presentation
 */
export async function updatePresentation(
  id: string,
  updates: Partial<Presentation>
): Promise<Presentation | null> {
  const existing = await getPresentation(id);
  if (!existing) return null;

  const updated: Presentation = {
    ...existing,
    ...updates,
    id: existing.id,
    updatedAt: new Date(),
  };

  await savePresentation(updated);
  return updated;
}

/**
 * Delete a presentation
 */
export async function deletePresentation(id: string): Promise<boolean> {
  return await deleteOne(SUBDIRECTORY, id);
}

/**
 * Get presentations by plan ID
 */
export async function getPresentationsByPlan(
  planId: string
): Promise<Presentation[]> {
  const all = await readAllFromDir<Presentation>(SUBDIRECTORY);
  const presentations = all
    .filter((p) => p.planId === planId)
    .map((p) =>
      parseDates(p, ["createdAt", "updatedAt", "scheduledAt", "deliveredAt"])
    );

  return presentations.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

/**
 * Mark a presentation as delivered
 */
export async function markAsDelivered(
  id: string,
  data: {
    deliveredAt?: Date;
    audienceSize?: number;
    feedback?: string;
  }
): Promise<Presentation | null> {
  return await updatePresentation(id, {
    status: PresentationStatus.DELIVERED,
    deliveredAt: data.deliveredAt || new Date(),
    audienceSize: data.audienceSize,
    feedback: data.feedback,
  });
}

/**
 * Generate a new presentation ID
 */
export function generatePresentationId(): string {
  return generateId("presentation");
}
