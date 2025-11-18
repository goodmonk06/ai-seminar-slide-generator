import { z } from "zod";

// SlidePlanInput validation schema
export const SlidePlanInputSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内で入力してください"),
  audience: z
    .string()
    .min(1, "対象者は必須です")
    .max(100, "対象者は100文字以内で入力してください"),
  durationMinutes: z
    .number()
    .int("整数で入力してください")
    .min(1, "講演時間は1分以上で指定してください")
    .max(180, "講演時間は180分以内で指定してください"),
  keywords: z
    .string()
    .max(500, "キーワードは500文字以内で入力してください")
    .optional(),
});

export type SlidePlanInput = z.infer<typeof SlidePlanInputSchema>;

// SlidePlan type
export interface SlidePlan {
  id: string;
  title: string;
  audience: string;
  durationMinutes: number;
  keywords?: string;
  outlineMarkdown: string;
  createdAt: Date;
}

// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
