/**
 * Notification Adapter
 * Sends notifications based on domain events
 */

import { eventBus } from "../eventbus";
import {
  EventType,
  PlanCreatedEvent,
  PresentationDeliveredEvent,
} from "../types";

export interface Notification {
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
}

export interface INotificationService {
  send(notification: Notification): Promise<void>;
}

/**
 * Mock notification service for demonstration
 */
class ConsoleNotificationService implements INotificationService {
  async send(notification: Notification): Promise<void> {
    console.log("[Notification]", {
      to: notification.to,
      subject: notification.subject,
      preview: notification.body.substring(0, 50) + "...",
    });
  }
}

export class NotificationAdapter {
  private unsubscribers: Array<() => void> = [];

  constructor(
    private service: INotificationService = new ConsoleNotificationService()
  ) {}

  /**
   * Start sending notifications
   */
  start(): void {
    // Notify on plan creation
    this.unsubscribers.push(
      eventBus.subscribe(
        EventType.PLAN_CREATED,
        this.notifyPlanCreated.bind(this),
        "notification-plan-created"
      )
    );

    // Notify on presentation delivery
    this.unsubscribers.push(
      eventBus.subscribe(
        EventType.PRESENTATION_DELIVERED,
        this.notifyPresentationDelivered.bind(this),
        "notification-presentation-delivered"
      )
    );

    console.log("[NotificationAdapter] Started sending notifications");
  }

  /**
   * Stop sending notifications
   */
  stop(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
    console.log("[NotificationAdapter] Stopped sending notifications");
  }

  /**
   * Notify on plan creation
   */
  private async notifyPlanCreated(event: any): Promise<void> {
    const typedEvent = event as PlanCreatedEvent;
    const { plan } = typedEvent.data;

    // In production, this would get the user's email
    const userEmail = "user@example.com";

    await this.service.send({
      to: userEmail,
      subject: "New Slide Plan Created",
      body: `Your slide plan "${plan.title}" has been created successfully.\n\nDuration: ${plan.durationMinutes} minutes\nAudience: ${plan.audience}\n\nView your plan to see the generated outline.`,
      timestamp: typedEvent.timestamp,
    });
  }

  /**
   * Notify on presentation delivery
   */
  private async notifyPresentationDelivered(event: any): Promise<void> {
    const typedEvent = event as PresentationDeliveredEvent;
    const { presentation } = typedEvent.data;

    // In production, this would get the user's email
    const userEmail = "user@example.com";

    await this.service.send({
      to: userEmail,
      subject: "Presentation Delivered Successfully",
      body: `Congratulations! Your presentation "${presentation.title}" has been delivered.\n\nVenue: ${typedEvent.data.presentation.venue || "N/A"}\nAudience Size: ${typedEvent.data.presentation.audienceSize || "N/A"}\n\nDon't forget to collect feedback!`,
      timestamp: typedEvent.timestamp,
    });
  }
}

// Singleton instance
export const notificationAdapter = new NotificationAdapter();
