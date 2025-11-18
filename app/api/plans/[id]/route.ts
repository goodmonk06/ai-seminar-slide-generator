import { NextRequest } from "next/server";
import { getSlidePlan } from "@/lib/storage";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return errorResponse("有効なIDを指定してください", 400, "INVALID_ID");
    }

    const plan = await getSlidePlan(id);

    if (!plan) {
      return errorResponse(
        "スライドプランが見つかりません",
        404,
        "NOT_FOUND"
      );
    }

    return successResponse({ plan });
  } catch (error) {
    return handleApiError(error);
  }
}
