/**
 * OpenAI Provider Implementation
 */

import { SlidePlanInput } from "../types";
import {
  ISlideGeneratorProvider,
  SlideGenerationResult,
  ProviderConfig,
} from "./types";

// Type-safe OpenAI client types (avoiding full SDK dependency for now)
interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
}

interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

export class OpenAIProvider implements ISlideGeneratorProvider {
  readonly name = "openai";
  private config: ProviderConfig;

  constructor(config: ProviderConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      model: config.model || "gpt-4-turbo-preview",
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.7,
      ...config,
    };
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  getMetadata() {
    return {
      name: "OpenAI GPT",
      version: "1.0.0",
      supportedModels: [
        "gpt-4-turbo-preview",
        "gpt-4",
        "gpt-3.5-turbo",
      ],
    };
  }

  async generateOutline(input: SlidePlanInput): Promise<SlideGenerationResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "OpenAI provider is not configured. Set OPENAI_API_KEY environment variable."
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

    const requestBody: OpenAICompletionRequest = {
      model: this.config.model as string,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: this.config.maxTokens as number,
      temperature: this.config.temperature as number,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data: OpenAICompletionResponse = await response.json();
    const durationMs = Date.now() - startTime;

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI API response");
    }

    return {
      outlineMarkdown: content,
      modelUsed: this.config.model as string,
      tokensUsed: data.usage?.total_tokens,
      durationMs,
    };
  }
}
