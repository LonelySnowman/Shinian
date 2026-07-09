import type { DomainEvent, EventBus } from '@/src/core/application/bus/EventBus';
import {
  SyncAnniversaryToCalendarUseCase,
  UnsyncAnniversaryFromCalendarUseCase,
} from '@/src/features/calendar-sync/application/calendarUseCases';

export class CalendarSyncService {
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly eventBus: EventBus,
    private readonly syncAnniversary: SyncAnniversaryToCalendarUseCase,
    private readonly unsyncAnniversary: UnsyncAnniversaryFromCalendarUseCase,
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
    void this.syncAnniversary.execute(payload.id);
  }

  private handleCancel(event: DomainEvent): void {
    const payload = event.payload as { id: string };
    void this.unsyncAnniversary.execute(payload.id);
  }
}
