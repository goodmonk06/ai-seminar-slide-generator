import { NextRequest } from "next/server";
import { generateSlideOutline } from "@/lib/ai";
import { saveSlidePlan, generateId } from "@/lib/storage";
import { SlidePlan, SlidePlanInputSchema } from "@/lib/types";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body = await request.json();

    // Zodバリデーション
    const validatedInput = SlidePlanInputSchema.parse(body);

    // AI APIキーのチェック
    if (!process.env.ANTHROPIC_API_KEY) {
      return errorResponse(
        "APIキーが設定されていません。環境変数ANTHROPIC_API_KEYを設定してください。",
        500,
        "API_KEY_MISSING"
      );
    }

    // スライド構成の生成
    const outlineMarkdown = await generateSlideOutline(validatedInput);

    // スライドプランの作成と保存
    const now = new Date();
    const plan: SlidePlan = {
      id: generateId(),
      title: validatedInput.title,
      audience: validatedInput.audience,
      durationMinutes: validatedInput.durationMinutes,
      keywords: validatedInput.keywords,
      outlineMarkdown,
      templateId: validatedInput.templateId,
      userId: validatedInput.userId,
      tags: validatedInput.tags || [],
      metadata: {},
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await saveSlidePlan(plan);

    return successResponse({ plan }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
