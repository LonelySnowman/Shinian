import type { EventBus } from '@/src/core/application/bus/EventBus';
import { RefreshWidgetsUseCase } from '@/src/features/widget/application/widgetUseCases';

export class WidgetSyncService {
  private unsubscribers: Array<() => void> = [];

  constructor(
    private readonly eventBus: EventBus,
    private readonly refreshWidgets: RefreshWidgetsUseCase,
  ) {}

  start(): void {
    this.stop();

    const refresh = () => {
      void this.refreshWidgets.execute();
    };

    this.unsubscribers = [
      this.eventBus.subscribe('anniversary.created', refresh),
      this.eventBus.subscribe('anniversary.updated', refresh),
      this.eventBus.subscribe('anniversary.deleted', refresh),
      this.eventBus.subscribe('anniversary.archived', refresh),
      this.eventBus.subscribe('anniversary.restored', refresh),
    ];
  }

  stop(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }
}
