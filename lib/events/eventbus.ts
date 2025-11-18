/**
 * Event Bus Implementation
 * Simple in-memory event bus for domain events
 */

import {
  DomainEvent,
  EventType,
  EventHandler,
  EventSubscriber,
  AnyDomainEvent,
} from "./types";

class EventBus {
  private subscribers: Map<string, EventSubscriber[]> = new Map();
  private globalSubscribers: EventSubscriber[] = [];

  /**
   * Subscribe to a specific event type
   */
  subscribe(eventType: EventType | string, handler: EventHandler, name?: string): () => void {
    const subscriber: EventSubscriber = {
      name: name || `subscriber-${Date.now()}`,
      handle: handler,
    };

    const existing = this.subscribers.get(eventType) || [];
    this.subscribers.set(eventType, [...existing, subscriber]);

    // Return unsubscribe function
    return () => {
      const current = this.subscribers.get(eventType) || [];
      this.subscribers.set(
        eventType,
        current.filter((s) => s !== subscriber)
      );
    };
  }

  /**
   * Subscribe to all events
   */
  subscribeAll(handler: EventHandler, name?: string): () => void {
    const subscriber: EventSubscriber = {
      name: name || `global-subscriber-${Date.now()}`,
      handle: handler,
    };

    this.globalSubscribers.push(subscriber);

    // Return unsubscribe function
    return () => {
      this.globalSubscribers = this.globalSubscribers.filter(
        (s) => s !== subscriber
      );
    };
  }

  /**
   * Publish an event to all subscribers
   */
  async publish(event: AnyDomainEvent): Promise<void> {
    // Get specific subscribers for this event type
    const typeSubscribers = this.subscribers.get(event.type) || [];

    // Combine with global subscribers
    const allSubscribers = [...typeSubscribers, ...this.globalSubscribers];

    // Execute all handlers (in parallel for better performance)
    await Promise.all(
      allSubscribers.map(async (subscriber) => {
        try {
          await subscriber.handle(event);
        } catch (error) {
          console.error(
            `Error in event handler ${subscriber.name}:`,
            error
          );
        }
      })
    );
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  clear(): void {
    this.subscribers.clear();
    this.globalSubscribers = [];
  }

  /**
   * Get subscriber count for debugging
   */
  getSubscriberCount(eventType?: EventType | string): number {
    if (eventType) {
      return (this.subscribers.get(eventType) || []).length;
    }
    let total = this.globalSubscribers.length;
    this.subscribers.forEach((subs) => {
      total += subs.length;
    });
    return total;
  }
}

// Singleton instance
export const eventBus = new EventBus();

/**
 * Helper function to create domain events
 */
export function createEvent<T extends DomainEvent>(
  type: EventType,
  data: T["data"],
  metadata?: Record<string, unknown>
): T {
  return {
    type,
    timestamp: new Date(),
    data,
    metadata,
  } as T;
}
