import { NextRequest } from "next/server";
import {
  savePresentation,
  getAllPresentations,
  generatePresentationId,
} from "@/lib/storage/presentations";
import {
  Presentation,
  PresentationInputSchema,
  PresentationFilters,
  PresentationStatus,
} from "@/lib/types";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { getSlidePlan } from "@/lib/storage";

/**
 * GET /api/presentations
 * List all presentations with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: PresentationFilters = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      userId: searchParams.get("userId") || undefined,
      status: searchParams.get("status") as PresentationStatus || undefined,
      dateFrom: searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined,
      dateTo: searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    };

    const result = await getAllPresentations(filters);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/presentations
 * Create a new presentation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedInput = PresentationInputSchema.parse(body);

    // Verify that the referenced plan exists
    const plan = await getSlidePlan(validatedInput.planId);
    if (!plan) {
      return errorResponse(
        "Referenced slide plan not found",
        404,
        "PLAN_NOT_FOUND"
      );
    }

    const now = new Date();
    const presentation: Presentation = {
      id: generatePresentationId(),
      planId: validatedInput.planId,
      title: validatedInput.title,
      venue: validatedInput.venue,
      scheduledAt: validatedInput.scheduledAt ? new Date(validatedInput.scheduledAt) : undefined,
      status: PresentationStatus.DRAFT,
      userId: validatedInput.userId,
      notes: validatedInput.notes,
      createdAt: now,
      updatedAt: now,
    };

    await savePresentation(presentation);

    return successResponse({ presentation }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
