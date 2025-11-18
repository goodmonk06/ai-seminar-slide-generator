/**
 * Plugin/Adapter Architecture - Provider Types
 * Defines interfaces for pluggable AI providers
 */

import { SlidePlanInput } from "../types";

/**
 * Result of a slide generation request
 */
export interface SlideGenerationResult {
  outlineMarkdown: string;
  modelUsed: string;
  tokensUsed?: number;
  durationMs: number;
}

/**
 * Configuration for AI providers
 */
export interface ProviderConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  [key: string]: unknown;
}

/**
 * Interface for all slide generation providers
 * Allows swapping between Anthropic, OpenAI, or mock implementations
 */
export interface ISlideGeneratorProvider {
  /**
   * Unique identifier for this provider
   */
  readonly name: string;

  /**
   * Generate slide outline from input parameters
   */
  generateOutline(input: SlidePlanInput): Promise<SlideGenerationResult>;

  /**
   * Validate that the provider is properly configured
   */
  isConfigured(): boolean;

  /**
   * Get provider-specific metadata
   */
  getMetadata(): {
    name: string;
    version: string;
    supportedModels: string[];
  };
}

/**
 * Provider type discriminator
 */
export enum ProviderType {
  ANTHROPIC = "anthropic",
  OPENAI = "openai",
  MOCK = "mock",
}
