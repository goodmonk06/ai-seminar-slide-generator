import { z } from "zod";

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum PresentationStatus {
  DRAFT = "draft",
  UPCOMING = "upcoming",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum TemplateCategory {
  TECHNOLOGY = "technology",
  BUSINESS = "business",
  ACADEMIC = "academic",
  TRAINING = "training",
  SALES = "sales",
  GENERAL = "general",
}

// ============================================================================
// SLIDE PLAN (Enhanced)
// ============================================================================

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
  templateId: z.string().optional(),
  userId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type SlidePlanInput = z.infer<typeof SlidePlanInputSchema>;

export interface SlidePlan {
  id: string;
  title: string;
  audience: string;
  durationMinutes: number;
  keywords?: string;
  outlineMarkdown: string;
  templateId?: string;
  userId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SLIDE TEMPLATE
// ============================================================================

export const SlideTemplateInputSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name must be under 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be under 500 characters"),
  category: z.nativeEnum(TemplateCategory),
  structure: z.string().min(1, "Template structure is required"),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  userId: z.string().optional(),
});

export type SlideTemplateInput = z.infer<typeof SlideTemplateInputSchema>;

export interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  structure: string; // Markdown template with placeholders
  tags: string[];
  isPublic: boolean;
  userId?: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PRESENTATION
// ============================================================================

export const PresentationInputSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  title: z.string().min(1, "Title is required").max(200),
  venue: z.string().max(200).optional(),
  scheduledAt: z.string().datetime().optional(),
  userId: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const PresentationUpdateSchema = z.object({
  status: z.nativeEnum(PresentationStatus).optional(),
  deliveredAt: z.string().datetime().optional(),
  venue: z.string().max(200).optional(),
  audienceSize: z.number().int().min(0).optional(),
  feedback: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export type PresentationInput = z.infer<typeof PresentationInputSchema>;
export type PresentationUpdate = z.infer<typeof PresentationUpdateSchema>;

export interface Presentation {
  id: string;
  planId: string;
  title: string;
  venue?: string;
  scheduledAt?: Date;
  deliveredAt?: Date;
  status: PresentationStatus;
  audienceSize?: number;
  feedback?: string;
  notes?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// USER
// ============================================================================

export const UserInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").max(100),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// GENERATION HISTORY
// ============================================================================

export interface GenerationHistory {
  id: string;
  planId: string;
  userId?: string;
  modelUsed: string;
  tokensUsed?: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
  timestamp: Date;
}

// ============================================================================
// TAG
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  category?: string;
  usageCount: number;
  createdAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

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

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// FILTERS
// ============================================================================

export interface SlidePlanFilters extends PaginationParams {
  userId?: string;
  tags?: string[];
  search?: string;
  minDuration?: number;
  maxDuration?: number;
}

export interface TemplateFilters extends PaginationParams {
  category?: TemplateCategory;
  isPublic?: boolean;
  tags?: string[];
  search?: string;
}

export interface PresentationFilters extends PaginationParams {
  userId?: string;
  status?: PresentationStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
