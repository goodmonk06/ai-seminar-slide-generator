/**
 * Event System Module
 * Exports all event-related functionality
 */

export * from "./types";
export * from "./eventbus";
export * from "./adapters/logging";
export * from "./adapters/analytics";
export * from "./adapters/notification";

// Re-export commonly used items
export { eventBus, createEvent } from "./eventbus";
export { loggingAdapter } from "./adapters/logging";
export { analyticsAdapter } from "./adapters/analytics";
export { notificationAdapter } from "./adapters/notification";
