import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiSuccessResponse, ApiErrorResponse } from "./types";

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiErrorResponse> {
  const firstError = error.issues?.[0];
  const message = firstError?.message || "バリデーションエラーが発生しました";

  return errorResponse(message, 400, "VALIDATION_ERROR", error.issues);
}

/**
 * Handle unknown errors
 */
export function handleUnknownError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("Unexpected error:", error);

  if (error instanceof Error) {
    return errorResponse(error.message, 500, "INTERNAL_ERROR");
  }

  return errorResponse(
    "予期しないエラーが発生しました",
    500,
    "UNKNOWN_ERROR"
  );
}

/**
 * Catch-all error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  return handleUnknownError(error);
}
