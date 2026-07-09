import SenaWidget from '@/widgets/SenaWidget';

import type { WidgetPort, WidgetSnapshotProps } from '@/src/core/domain/ports/WidgetPort';

class ExpoWidgetPort implements WidgetPort {
  isSupported(): boolean {
    return true;
  }

  async refresh(snapshot: WidgetSnapshotProps): Promise<void> {
    SenaWidget.updateSnapshot(snapshot);
    SenaWidget.reload();
  }
}

export function createWidgetPort(): WidgetPort {
  return new ExpoWidgetPort();
}
