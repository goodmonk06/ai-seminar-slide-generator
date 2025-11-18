/**
 * Logging Adapter
 * Logs all domain events for audit and debugging
 */

import { eventBus } from "../eventbus";
import { DomainEvent, EventType } from "../types";

export class LoggingAdapter {
  private unsubscribe?: () => void;

  /**
   * Start logging all events
   */
  start(): void {
    this.unsubscribe = eventBus.subscribeAll(
      this.handleEvent.bind(this),
      "logging-adapter"
    );
    console.log("[LoggingAdapter] Started logging domain events");
  }

  /**
   * Stop logging events
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      console.log("[LoggingAdapter] Stopped logging domain events");
    }
  }

  /**
   * Handle incoming events
   */
  private handleEvent(event: DomainEvent): void {
    const logEntry = {
      timestamp: event.timestamp.toISOString(),
      type: event.type,
      data: this.sanitizeData(event.data),
      metadata: event.metadata,
    };

    // In production, this could send to a logging service
    console.log("[DomainEvent]", JSON.stringify(logEntry, null, 2));
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data: unknown): unknown {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const sanitized = { ...data } as any;

    // Remove sensitive fields
    const sensitiveFields = ["apiKey", "password", "token", "secret"];
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}

// Singleton instance
export const loggingAdapter = new LoggingAdapter();
