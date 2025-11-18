import { NextRequest } from "next/server";
import {
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/storage/templates";
import { SlideTemplateInputSchema } from "@/lib/types";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/templates/:id
 * Retrieve a single template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getTemplate(id);

    if (!template) {
      return errorResponse("Template not found", 404, "NOT_FOUND");
    }

    return successResponse({ template });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/templates/:id
 * Update an existing template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedInput = SlideTemplateInputSchema.parse(body);

    const existingTemplate = await getTemplate(id);
    if (!existingTemplate) {
      return errorResponse("Template not found", 404, "NOT_FOUND");
    }

    const updatedTemplate = await updateTemplate(id, {
      name: validatedInput.name,
      description: validatedInput.description,
      category: validatedInput.category,
      structure: validatedInput.structure,
      tags: validatedInput.tags,
      isPublic: validatedInput.isPublic,
      userId: validatedInput.userId,
    });

    return successResponse({ template: updatedTemplate });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/templates/:id
 * Delete a template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteTemplate(id);

    if (!success) {
      return errorResponse("Template not found", 404, "NOT_FOUND");
    }

    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
