import type { DomainEvent, EventBus } from '@/src/core/application/bus/EventBus';
import {
  EndAnniversaryLiveActivityUseCase,
  UpdateAnniversaryLiveActivityUseCase,
} from '@/src/features/live-activity/application/liveActivityUseCases';

export class LiveActivitySyncService {
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly eventBus: EventBus,
    private readonly updateLiveActivity: UpdateAnniversaryLiveActivityUseCase,
    private readonly endLiveActivity: EndAnniversaryLiveActivityUseCase,
  ) {}

  start(): void {
    this.stop();

    this.unsubscribers = [
      this.eventBus.subscribe('anniversary.updated', (event) => this.handleUpdate(event)),
      this.eventBus.subscribe('anniversary.restored', (event) => this.handleUpdate(event)),
      this.eventBus.subscribe('anniversary.archived', (event) => this.handleEnd(event)),
      this.eventBus.subscribe('anniversary.deleted', (event) => this.handleEnd(event)),
    ];
  }

  stop(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }

  private handleUpdate(event: { payload: unknown }): void {
    const payload = event.payload as { id: string };
    void this.updateLiveActivity.execute(payload.id);
  }

  private handleEnd(event: DomainEvent): void {
    const payload = event.payload as { id: string };
    void this.endLiveActivity.executeIfActive(payload.id);
  }
}
