/**
 * Event System Types
 * Defines domain events and event handler interfaces
 */

import { SlidePlan, SlideTemplate, Presentation } from "../types";

/**
 * Base event interface
 */
export interface DomainEvent {
  type: string;
  timestamp: Date;
  data: unknown;
  metadata?: Record<string, unknown>;
}

/**
 * Domain event types
 */
export enum EventType {
  // SlidePlan events
  PLAN_CREATED = "plan.created",
  PLAN_UPDATED = "plan.updated",
  PLAN_DELETED = "plan.deleted",
  PLAN_GENERATED = "plan.generated",

  // Template events
  TEMPLATE_CREATED = "template.created",
  TEMPLATE_UPDATED = "template.updated",
  TEMPLATE_DELETED = "template.deleted",
  TEMPLATE_USED = "template.used",

  // Presentation events
  PRESENTATION_CREATED = "presentation.created",
  PRESENTATION_UPDATED = "presentation.updated",
  PRESENTATION_SCHEDULED = "presentation.scheduled",
  PRESENTATION_DELIVERED = "presentation.delivered",
  PRESENTATION_CANCELLED = "presentation.cancelled",
}

/**
 * Specific event interfaces
 */
export interface PlanCreatedEvent extends DomainEvent {
  type: EventType.PLAN_CREATED;
  data: {
    plan: SlidePlan;
  };
}

export interface PlanGeneratedEvent extends DomainEvent {
  type: EventType.PLAN_GENERATED;
  data: {
    plan: SlidePlan;
    modelUsed: string;
    tokensUsed?: number;
    durationMs: number;
  };
}

export interface TemplateCreatedEvent extends DomainEvent {
  type: EventType.TEMPLATE_CREATED;
  data: {
    template: SlideTemplate;
  };
}

export interface TemplateUsedEvent extends DomainEvent {
  type: EventType.TEMPLATE_USED;
  data: {
    templateId: string;
    planId: string;
  };
}

export interface PresentationDeliveredEvent extends DomainEvent {
  type: EventType.PRESENTATION_DELIVERED;
  data: {
    presentation: Presentation;
  };
}

/**
 * Union type of all events
 */
export type AnyDomainEvent =
  | PlanCreatedEvent
  | PlanGeneratedEvent
  | TemplateCreatedEvent
  | TemplateUsedEvent
  | PresentationDeliveredEvent
  | DomainEvent;

/**
 * Event handler function type
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

/**
 * Event subscriber interface
 */
export interface EventSubscriber {
  name: string;
  handle: EventHandler;
}
