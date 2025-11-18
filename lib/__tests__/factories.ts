/**
 * Test Factories
 * Provides helper functions to create test data easily
 */

import {
  SlidePlan,
  SlideTemplate,
  Presentation,
  User,
  TemplateCategory,
  PresentationStatus,
} from "../types";
import { generateId } from "../storage/base";

/**
 * Create a slide plan with default or custom values
 */
export function createSlidePlan(overrides?: Partial<SlidePlan>): SlidePlan {
  const now = new Date();
  return {
    id: generateId("plan"),
    title: "Test Presentation",
    audience: "Developers",
    durationMinutes: 30,
    keywords: "testing, demo",
    outlineMarkdown: "# Test Slide\n- Point 1\n- Point 2\n- Point 3",
    version: 1,
    tags: [],
    metadata: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple slide plans
 */
export function createSlidePlans(count: number, overrides?: Partial<SlidePlan>): SlidePlan[] {
  return Array.from({ length: count }, (_, i) =>
    createSlidePlan({
      title: `Test Presentation ${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Create a template with default or custom values
 */
export function createTemplate(overrides?: Partial<SlideTemplate>): SlideTemplate {
  const now = new Date();
  return {
    id: generateId("template"),
    name: "Test Template",
    description: "A test template for testing",
    category: TemplateCategory.TECHNOLOGY,
    structure: "# Introduction\n- Point 1\n\n# Main Content\n- Point 2",
    tags: ["test"],
    isPublic: true,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple templates
 */
export function createTemplates(count: number, overrides?: Partial<SlideTemplate>): SlideTemplate[] {
  return Array.from({ length: count }, (_, i) =>
    createTemplate({
      name: `Test Template ${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Create a presentation with default or custom values
 */
export function createPresentation(overrides?: Partial<Presentation>): Presentation {
  const now = new Date();
  return {
    id: generateId("presentation"),
    planId: generateId("plan"),
    title: "Test Presentation",
    status: PresentationStatus.DRAFT,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple presentations
 */
export function createPresentations(count: number, overrides?: Partial<Presentation>): Presentation[] {
  return Array.from({ length: count }, (_, i) =>
    createPresentation({
      title: `Test Presentation ${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Create a user with default or custom values
 */
export function createUser(overrides?: Partial<User>): User {
  const now = new Date();
  return {
    id: generateId("user"),
    email: `test@example.com`,
    name: "Test User",
    preferences: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple users
 */
export function createUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) =>
    createUser({
      email: `test${i + 1}@example.com`,
      name: `Test User ${i + 1}`,
    })
  );
}

/**
 * Helper to create a complete scenario (plan + presentation)
 */
export function createPlanWithPresentation(planOverrides?: Partial<SlidePlan>, presOverrides?: Partial<Presentation>) {
  const plan = createSlidePlan(planOverrides);
  const presentation = createPresentation({
    planId: plan.id,
    title: plan.title,
    ...presOverrides,
  });
  return { plan, presentation };
}

/**
 * Helper to create a plan with a template
 */
export function createPlanWithTemplate(planOverrides?: Partial<SlidePlan>, templateOverrides?: Partial<SlideTemplate>) {
  const template = createTemplate(templateOverrides);
  const plan = createSlidePlan({
    templateId: template.id,
    ...planOverrides,
  });
  return { plan, template };
}
