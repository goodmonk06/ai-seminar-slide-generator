/**
 * Anthropic Claude Provider Implementation
 */

import Anthropic from "@anthropic-ai/sdk";
import { SlidePlanInput } from "../types";
import {
  ISlideGeneratorProvider,
  SlideGenerationResult,
  ProviderConfig,
} from "./types";

export class AnthropicProvider implements ISlideGeneratorProvider {
  readonly name = "anthropic";
  private client: Anthropic | null = null;
  private config: ProviderConfig;

  constructor(config: ProviderConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
      model: config.model || "claude-3-5-sonnet-20241022",
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 1,
      ...config,
    };

    if (this.config.apiKey) {
      this.client = new Anthropic({
        apiKey: this.config.apiKey as string,
      });
    }
  }

  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.client;
  }

  getMetadata() {
    return {
      name: "Anthropic Claude",
      version: "1.0.0",
      supportedModels: [
        "claude-3-5-sonnet-20241022",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
      ],
    };
  }

  async generateOutline(input: SlidePlanInput): Promise<SlideGenerationResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "Anthropic provider is not configured. Set ANTHROPIC_API_KEY environment variable."
      );
    }

    const startTime = Date.now();

    const systemPrompt = `あなたは講演資料作成のプロフェッショナルです。
与えられたテーマ、対象者、講演時間から効果的なスライド構成案を作成してください。

各セクションについて以下の形式で出力してください：
# セクション名
- トークポイント1
- トークポイント2
- トークポイント3

講演時間に応じて適切なセクション数を決定してください（目安：5分あたり1-2セクション）。`;

    const userPrompt = `
【講演テーマ】
${input.title}

【対象者】
${input.audience}

【講演時間】
${input.durationMinutes}分

${input.keywords ? `【キーワード】\n${input.keywords}\n` : ""}
上記の情報を元に、効果的なスライド構成案を作成してください。`;

    const message = await this.client!.messages.create({
      model: this.config.model as string,
      max_tokens: this.config.maxTokens as number,
      temperature: this.config.temperature as number,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const durationMs = Date.now() - startTime;

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in API response");
    }

    return {
      outlineMarkdown: textContent.text,
      modelUsed: this.config.model as string,
      tokensUsed: message.usage?.input_tokens
        ? message.usage.input_tokens + (message.usage.output_tokens || 0)
        : undefined,
      durationMs,
    };
  }
}
