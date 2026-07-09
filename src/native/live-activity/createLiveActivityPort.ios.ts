import SenaLiveActivity from '@/widgets/SenaLiveActivity';

import type {
  LiveActivityPayload,
  LiveActivityPort,
} from '@/src/core/domain/ports/LiveActivityPort';
import { buildLiveActivityDeepLink } from '@/src/features/live-activity/domain/buildLiveActivityPayload';

class ExpoLiveActivityPort implements LiveActivityPort {
  isSupported(): boolean {
    return true;
  }

  async start(payload: LiveActivityPayload): Promise<void> {
    SenaLiveActivity.start(payload, buildLiveActivityDeepLink(payload.anniversaryId));
  }

  async update(payload: LiveActivityPayload): Promise<void> {
    const instances = SenaLiveActivity.getInstances();
    if (instances.length === 0) {
      await this.start(payload);
      return;
    }

    await Promise.all(instances.map((instance) => instance.update(payload)));
  }

  async end(): Promise<void> {
    const instances = SenaLiveActivity.getInstances();
    await Promise.all(instances.map((instance) => instance.end('immediate')));
  }

  async hasActiveActivity(): Promise<boolean> {
    return SenaLiveActivity.getInstances().length > 0;
  }
}

export function createLiveActivityPort(): LiveActivityPort {
  return new ExpoLiveActivityPort();
}
