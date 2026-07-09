import { Platform } from 'react-native';

import type { LiveActivityPort } from '@/src/core/domain/ports/LiveActivityPort';

export class NoopLiveActivityPort implements LiveActivityPort {
  isSupported(): boolean {
    return false;
  }

  async start(): Promise<void> {
    throw new Error('Live Activity is not supported on this platform');
  }

  async update(): Promise<void> {}

  async end(): Promise<void> {}

  async hasActiveActivity(): Promise<boolean> {
    return false;
  }
}

export function createLiveActivityPort(): LiveActivityPort {
  if (Platform.OS !== 'ios') {
    return new NoopLiveActivityPort();
  }

  return new NoopLiveActivityPort();
}
