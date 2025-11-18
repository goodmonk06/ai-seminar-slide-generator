/**
 * Analytics Adapter
 * Tracks usage metrics and sends to analytics service
 */

import { eventBus } from "../eventbus";
import {
  EventType,
  PlanGeneratedEvent,
  TemplateUsedEvent,
  PresentationDeliveredEvent,
} from "../types";

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

export interface IAnalyticsService {
  track(event: AnalyticsEvent): Promise<void>;
}

/**
 * Mock analytics service for demonstration
 */
class ConsoleAnalyticsService implements IAnalyticsService {
  async track(event: AnalyticsEvent): Promise<void> {
    console.log("[Analytics]", event.event, event.properties);
  }
}

export class AnalyticsAdapter {
  private unsubscribers: Array<() => void> = [];

  constructor(private service: IAnalyticsService = new ConsoleAnalyticsService()) {}

  /**
   * Start tracking analytics events
   */
  start(): void {
    // Track plan generation
    this.unsubscribers.push(
      eventBus.subscribe(
        EventType.PLAN_GENERATED,
        this.trackPlanGenerated.bind(this),
        "analytics-plan-generated"
      )
    );

    // Track template usage
    this.unsubscribers.push(
      eventBus.subscribe(
        EventType.TEMPLATE_USED,
        this.trackTemplateUsed.bind(this),
        "analytics-template-used"
      )
    );

    // Track presentation delivery
    this.unsubscribers.push(
      eventBus.subscribe(
        EventType.PRESENTATION_DELIVERED,
        this.trackPresentationDelivered.bind(this),
        "analytics-presentation-delivered"
      )
    );

    console.log("[AnalyticsAdapter] Started tracking analytics");
  }

  /**
   * Stop tracking
   */
  stop(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
    console.log("[AnalyticsAdapter] Stopped tracking analytics");
  }

  /**
   * Track plan generation
   */
  private async trackPlanGenerated(event: any): Promise<void> {
    const typedEvent = event as PlanGeneratedEvent;
    await this.service.track({
      event: "plan_generated",
      properties: {
        planId: typedEvent.data.plan.id,
        durationMinutes: typedEvent.data.plan.durationMinutes,
        modelUsed: typedEvent.data.modelUsed,
        tokensUsed: typedEvent.data.tokensUsed,
        generationTimeMs: typedEvent.data.durationMs,
        hasTemplate: !!typedEvent.data.plan.templateId,
      },
      timestamp: typedEvent.timestamp,
    });
  }

  /**
   * Track template usage
   */
  private async trackTemplateUsed(event: any): Promise<void> {
    const typedEvent = event as TemplateUsedEvent;
    await this.service.track({
      event: "template_used",
      properties: {
        templateId: typedEvent.data.templateId,
        planId: typedEvent.data.planId,
      },
      timestamp: typedEvent.timestamp,
    });
  }

  /**
   * Track presentation delivery
   */
  private async trackPresentationDelivered(event: any): Promise<void> {
    const typedEvent = event as PresentationDeliveredEvent;
    await this.service.track({
      event: "presentation_delivered",
      properties: {
        presentationId: typedEvent.data.presentation.id,
        planId: typedEvent.data.presentation.planId,
        audienceSize: typedEvent.data.presentation.audienceSize,
        venue: typedEvent.data.presentation.venue,
      },
      timestamp: typedEvent.timestamp,
    });
  }
}

// Singleton instance
export const analyticsAdapter = new AnalyticsAdapter();
