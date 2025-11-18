import { NextRequest, NextResponse } from "next/server";
import { generateSlideOutline } from "@/lib/ai";
import { saveSlidePlan, generateId } from "@/lib/storage";
import { SlidePlan, SlidePlanInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body: SlidePlanInput = await request.json();

    // バリデーション
    if (!body.title || !body.audience || !body.durationMinutes) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    if (body.durationMinutes < 1 || body.durationMinutes > 180) {
      return NextResponse.json(
        { error: "講演時間は1〜180分の間で指定してください" },
        { status: 400 }
      );
    }

    // AI APIキーのチェック
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "APIキーが設定されていません" },
        { status: 500 }
      );
    }

    // スライド構成の生成
    const outlineMarkdown = await generateSlideOutline(body);

    // スライドプランの作成と保存
    const plan: SlidePlan = {
      id: generateId(),
      title: body.title,
      audience: body.audience,
      durationMinutes: body.durationMinutes,
      keywords: body.keywords,
      outlineMarkdown,
      createdAt: new Date(),
    };

    await saveSlidePlan(plan);

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error generating slide plan:", error);
    return NextResponse.json(
      { error: "スライド構成の生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
