import type { WidgetPort, WidgetSnapshotProps } from '@/src/core/domain/ports/WidgetPort';

export class NoopWidgetPort implements WidgetPort {
  isSupported(): boolean {
    return false;
  }

  async refresh(_snapshot: WidgetSnapshotProps): Promise<void> {}
}

export function createWidgetPort(): WidgetPort {
  return new NoopWidgetPort();
}
