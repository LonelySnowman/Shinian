import type { DomainEvent, EventBus } from '@/src/core/application/bus/EventBus';
import {
  CancelRemindersForAnniversaryUseCase,
  ScheduleRemindersForAnniversaryUseCase,
} from '@/src/features/notification/application/reminderUseCases';

export class NotificationSyncService {
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly eventBus: EventBus,
    private readonly scheduleReminders: ScheduleRemindersForAnniversaryUseCase,
    private readonly cancelReminders: CancelRemindersForAnniversaryUseCase,
  ) {}

  start(): void {
    this.stop();

    this.unsubscribers = [
      this.eventBus.subscribe('anniversary.created', (event) => this.handleUpsert(event)),
      this.eventBus.subscribe('anniversary.updated', (event) => this.handleUpsert(event)),
      this.eventBus.subscribe('anniversary.restored', (event) => this.handleUpsert(event)),
      this.eventBus.subscribe('anniversary.archived', (event) => this.handleCancel(event)),
      this.eventBus.subscribe('anniversary.deleted', (event) => this.handleCancel(event)),
    ];
  }

  stop(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }

  private handleUpsert(event: DomainEvent): void {
    const payload = event.payload as { id: string };
    void this.scheduleReminders.execute(payload.id);
  }

  private handleCancel(event: DomainEvent): void {
    const payload = event.payload as { id: string };
    void this.cancelReminders.execute(payload.id);
  }
}
