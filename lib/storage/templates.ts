/**
 * Storage layer for SlideTemplate entities
 */

import {
  SlideTemplate,
  TemplateFilters,
  PaginatedResponse,
} from "../types";
import {
  readAllFromDir,
  readOne,
  writeOne,
  deleteOne,
  generateId,
  parseDates,
} from "./base";

const SUBDIRECTORY = "templates";

/**
 * Save a slide template
 */
export async function saveTemplate(template: SlideTemplate): Promise<void> {
  await writeOne(SUBDIRECTORY, template.id, template);
}

/**
 * Get a template by ID
 */
export async function getTemplate(id: string): Promise<SlideTemplate | null> {
  const data = await readOne<SlideTemplate>(SUBDIRECTORY, id);
  if (!data) return null;

  return parseDates(data, ["createdAt", "updatedAt"]);
}

/**
 * Get all templates with optional filtering and pagination
 */
export async function getAllTemplates(
  filters?: TemplateFilters
): Promise<PaginatedResponse<SlideTemplate>> {
  const all = await readAllFromDir<SlideTemplate>(SUBDIRECTORY);

  // Parse dates
  const templates = all.map((t) =>
    parseDates(t, ["createdAt", "updatedAt"])
  );

  // Apply filters
  let filtered = templates;

  if (filters?.category) {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  if (filters?.isPublic !== undefined) {
    filtered = filtered.filter((t) => t.isPublic === filters.isPublic);
  }

  if (filters?.tags && filters.tags.length > 0) {
    filtered = filtered.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }

  // Sort
  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.sortOrder || "desc";
  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof SlideTemplate];
    const bVal = b[sortBy as keyof SlideTemplate];

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
}

/**
 * Update a template
 */
export async function updateTemplate(
  id: string,
  updates: Partial<SlideTemplate>
): Promise<SlideTemplate | null> {
  const existing = await getTemplate(id);
  if (!existing) return null;

  const updated: SlideTemplate = {
    ...existing,
    ...updates,
    id: existing.id, // Ensure ID doesn't change
    updatedAt: new Date(),
  };

  await saveTemplate(updated);
  return updated;
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  return await deleteOne(SUBDIRECTORY, id);
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(
  id: string
): Promise<SlideTemplate | null> {
  const template = await getTemplate(id);
  if (!template) return null;

  return await updateTemplate(id, {
    usageCount: template.usageCount + 1,
  });
}

/**
 * Generate a new template ID
 */
export function generateTemplateId(): string {
  return generateId("template");
}
