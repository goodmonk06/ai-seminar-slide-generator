import { NextRequest } from "next/server";
import {
  getPresentation,
  updatePresentation,
  deletePresentation,
} from "@/lib/storage/presentations";
import { PresentationUpdateSchema } from "@/lib/types";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/presentations/:id
 * Retrieve a single presentation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const presentation = await getPresentation(id);

    if (!presentation) {
      return errorResponse("Presentation not found", 404, "NOT_FOUND");
    }

    return successResponse({ presentation });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/presentations/:id
 * Update an existing presentation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedInput = PresentationUpdateSchema.parse(body);

    const existingPresentation = await getPresentation(id);
    if (!existingPresentation) {
      return errorResponse("Presentation not found", 404, "NOT_FOUND");
    }

    const updatedPresentation = await updatePresentation(id, {
      status: validatedInput.status,
      deliveredAt: validatedInput.deliveredAt ? new Date(validatedInput.deliveredAt) : undefined,
      venue: validatedInput.venue,
      audienceSize: validatedInput.audienceSize,
      feedback: validatedInput.feedback,
      notes: validatedInput.notes,
    });

    return successResponse({ presentation: updatedPresentation });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/presentations/:id
 * Delete a presentation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deletePresentation(id);

    if (!success) {
      return errorResponse("Presentation not found", 404, "NOT_FOUND");
    }

    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
