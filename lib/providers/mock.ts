/**
 * Mock Provider Implementation
 * Useful for testing and development without API calls
 */

import { SlidePlanInput } from "../types";
import {
  ISlideGeneratorProvider,
  SlideGenerationResult,
  ProviderConfig,
} from "./types";

export class MockProvider implements ISlideGeneratorProvider {
  readonly name = "mock";
  private config: ProviderConfig;
  private delay: number;

  constructor(config: ProviderConfig = {}) {
    this.config = config;
    this.delay = (config.delay as number) || 100; // Simulate API latency
  }

  isConfigured(): boolean {
    return true; // Mock provider is always configured
  }

  getMetadata() {
    return {
      name: "Mock Provider",
      version: "1.0.0",
      supportedModels: ["mock-v1"],
    };
  }

  async generateOutline(input: SlidePlanInput): Promise<SlideGenerationResult> {
    const startTime = Date.now();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Calculate appropriate number of sections based on duration
    const sectionsCount = Math.max(2, Math.ceil(input.durationMinutes / 5));

    // Generate mock outline
    const sections: string[] = [];

    sections.push("# イントロダクション");
    sections.push("- 本日のテーマと目的");
    sections.push(`- ${input.audience}の皆様へのメッセージ`);
    sections.push("- アジェンダの紹介");
    sections.push("");

    for (let i = 1; i < sectionsCount - 1; i++) {
      sections.push(`# セクション ${i}: ${input.title}の重要ポイント`);
      sections.push(`- ポイント ${i}-1: 基本概念の説明`);
      sections.push(`- ポイント ${i}-2: 実践的な適用方法`);
      sections.push(`- ポイント ${i}-3: 期待される効果`);
      sections.push("");
    }

    sections.push("# まとめと質疑応答");
    sections.push("- 本日のキーポイントの振り返り");
    sections.push("- 次のアクションステップ");
    sections.push("- Q&A セッション");

    const outlineMarkdown = sections.join("\n");
    const durationMs = Date.now() - startTime;

    return {
      outlineMarkdown,
      modelUsed: "mock-v1",
      tokensUsed: outlineMarkdown.length, // Approximate token count
      durationMs,
    };
  }

  /**
   * Set custom delay for testing
   */
  setDelay(ms: number): void {
    this.delay = ms;
  }

  /**
   * Helper to create a provider that throws errors (for testing error handling)
   */
  static createFailingProvider(errorMessage: string = "Mock error"): MockProvider {
    const provider = new MockProvider();
    provider.generateOutline = async () => {
      throw new Error(errorMessage);
    };
    return provider;
  }
}
