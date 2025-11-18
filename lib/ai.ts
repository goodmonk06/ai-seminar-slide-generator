import Anthropic from "@anthropic-ai/sdk";
import { SlidePlanInput } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateSlideOutline(
  input: SlidePlanInput
): Promise<string> {
  const prompt = `あなたはプレゼンテーション資料作成のエキスパートです。以下の情報をもとに、効果的なスライド構成案を作成してください。

【講演情報】
- テーマ: ${input.title}
- 対象者: ${input.audience}
- 時間: ${input.durationMinutes}分
${input.keywords ? `- キーワード: ${input.keywords}` : ""}

【要件】
- スライド数は講演時間に応じて適切に設定（1スライド約1-2分を目安）
- 各セクションには明確な見出しをつける
- 各スライドには話すべきポイントを3つ程度箇条書きで含める
- オープニング、本論、クロージングの構成を意識する

【出力形式】
Markdown形式で以下のような構造で出力してください：

# スライド1: タイトル
- ポイント1
- ポイント2
- ポイント3

# スライド2: セクション名
- ポイント1
- ポイント2
- ポイント3

...

それでは、スライド構成案を作成してください。`;

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  throw new Error("Unexpected response format from AI");
}
