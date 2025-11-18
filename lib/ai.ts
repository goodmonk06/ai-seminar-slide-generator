/**
 * AI Integration Layer
 * Now uses pluggable provider architecture for extensibility
 */

import { SlidePlanInput } from "./types";
import { getDefaultProvider } from "./providers/factory";
import { ISlideGeneratorProvider, ProviderType } from "./providers/types";

/**
 * Generate slide outline using the configured provider
 * @deprecated Use generateSlideOutlineWithProvider for more control
 */
export async function generateSlideOutline(
  input: SlidePlanInput
): Promise<string> {
  const provider = getDefaultProvider();
  const result = await provider.generateOutline(input);
  return result.outlineMarkdown;
}

/**
 * Generate slide outline with full result metadata
 */
export async function generateSlideOutlineWithProvider(
  input: SlidePlanInput,
  providerType?: ProviderType
) {
  const provider = providerType
    ? getDefaultProvider()
    : getDefaultProvider();

  return await provider.generateOutline(input);
}

/**
 * Export provider types for external use
 */
export { ProviderType } from "./providers/types";
export type { ISlideGeneratorProvider } from "./providers/types";
