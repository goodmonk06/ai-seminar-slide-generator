import { NextRequest, NextResponse } from "next/server";
import { getSlidePlan } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await getSlidePlan(id);

    if (!plan) {
      return NextResponse.json(
        { error: "スライドプランが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error fetching slide plan:", error);
    return NextResponse.json(
      { error: "スライドプランの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
