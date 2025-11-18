/**
 * Provider Factory
 * Creates appropriate provider instances based on configuration
 */

import {
  ISlideGeneratorProvider,
  ProviderType,
  ProviderConfig,
} from "./types";
import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";
import { MockProvider } from "./mock";

/**
 * Create a provider instance based on type
 */
export function createProvider(
  type: ProviderType,
  config?: ProviderConfig
): ISlideGeneratorProvider {
  switch (type) {
    case ProviderType.ANTHROPIC:
      return new AnthropicProvider(config);
    case ProviderType.OPENAI:
      return new OpenAIProvider(config);
    case ProviderType.MOCK:
      return new MockProvider(config);
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

/**
 * Get the default provider based on environment configuration
 */
export function getDefaultProvider(config?: ProviderConfig): ISlideGeneratorProvider {
  const providerType = (process.env.AI_PROVIDER as ProviderType) || ProviderType.ANTHROPIC;
  return createProvider(providerType, config);
}

/**
 * Get all available providers with their configuration status
 */
export function getAvailableProviders(): Array<{
  type: ProviderType;
  configured: boolean;
  metadata: ReturnType<ISlideGeneratorProvider["getMetadata"]>;
}> {
  const providers = [
    ProviderType.ANTHROPIC,
    ProviderType.OPENAI,
    ProviderType.MOCK,
  ];

  return providers.map((type) => {
    const provider = createProvider(type);
    return {
      type,
      configured: provider.isConfigured(),
      metadata: provider.getMetadata(),
    };
  });
}
