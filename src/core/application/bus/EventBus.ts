export type DomainEventType =
  | 'anniversary.created'
  | 'anniversary.updated'
  | 'anniversary.deleted'
  | 'anniversary.archived'
  | 'anniversary.restored'
  | 'preferences.updated';

export interface DomainEvent<TPayload = unknown> {
  type: DomainEventType;
  payload: TPayload;
  occurredAt: string;
}

export type DomainEventHandler = (event: DomainEvent) => void;

export class EventBus {
  private readonly handlers = new Map<DomainEventType, Set<DomainEventHandler>>();

  publish<TPayload>(event: DomainEvent<TPayload>): void {
    const handlers = this.handlers.get(event.type);
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => handler(event as DomainEvent));
  }

  subscribe(type: DomainEventType, handler: DomainEventHandler): () => void {
    const set = this.handlers.get(type) ?? new Set<DomainEventHandler>();
    set.add(handler);
    this.handlers.set(type, set);

    return () => {
      set.delete(handler);
    };
  }
}
