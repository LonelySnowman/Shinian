import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type {
  NotificationIntent,
  NotificationPermissionStatus,
  NotificationPort,
} from '@/src/core/domain/ports/NotificationPort';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let channelReady = false;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) {
    return;
  }

  await Notifications.setNotificationChannelAsync('sena-reminders', {
    name: '纪念日提醒',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
  channelReady = true;
}

function mapPermissionStatus(status: Notifications.PermissionStatus): NotificationPermissionStatus {
  switch (status) {
    case Notifications.PermissionStatus.GRANTED:
      return 'granted';
    case Notifications.PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
}

export class ExpoNotificationAdapter implements NotificationPort {
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    const settings = await Notifications.getPermissionsAsync();
    return mapPermissionStatus(settings.status);
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    await ensureAndroidChannel();
    const settings = await Notifications.requestPermissionsAsync();
    return mapPermissionStatus(settings.status);
  }

  async schedule(intent: NotificationIntent): Promise<void> {
    await ensureAndroidChannel();

    if (intent.triggerAt.getTime() <= Date.now()) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      identifier: intent.id,
      content: {
        title: intent.title,
        body: intent.body,
        data: intent.data,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: intent.triggerAt,
        channelId: Platform.OS === 'android' ? 'sena-reminders' : undefined,
      },
    });
  }

  async cancel(id: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // Ignore missing identifiers.
    }
  }

  async cancelMany(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.cancel(id)));
  }

  async getPendingIds(): Promise<string[]> {
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    return pending.map((item) => item.identifier);
  }
}

export class NoopNotificationAdapter implements NotificationPort {
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    return 'denied';
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    return 'denied';
  }

  async schedule(_intent: NotificationIntent): Promise<void> {}

  async cancel(_id: string): Promise<void> {}

  async cancelMany(_ids: string[]): Promise<void> {}

  async getPendingIds(): Promise<string[]> {
    return [];
  }
}

export function createNotificationPort(): NotificationPort {
  if (Platform.OS === 'web') {
    return new NoopNotificationAdapter();
  }
  return new ExpoNotificationAdapter();
}
