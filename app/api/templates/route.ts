import { NextRequest } from "next/server";
import {
  saveTemplate,
  getAllTemplates,
  generateTemplateId,
} from "@/lib/storage/templates";
import { SlideTemplate, SlideTemplateInputSchema, TemplateFilters } from "@/lib/types";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/templates
 * List all templates with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: TemplateFilters = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      category: searchParams.get("category") as any || undefined,
      isPublic: searchParams.get("isPublic") ? searchParams.get("isPublic") === "true" : undefined,
      search: searchParams.get("search") || undefined,
      tags: searchParams.get("tags") ? searchParams.get("tags")!.split(",") : undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    };

    const result = await getAllTemplates(filters);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedInput = SlideTemplateInputSchema.parse(body);

    const now = new Date();
    const template: SlideTemplate = {
      id: generateTemplateId(),
      name: validatedInput.name,
      description: validatedInput.description,
      category: validatedInput.category,
      structure: validatedInput.structure,
      tags: validatedInput.tags || [],
      isPublic: validatedInput.isPublic,
      userId: validatedInput.userId,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await saveTemplate(template);

    return successResponse({ template }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
