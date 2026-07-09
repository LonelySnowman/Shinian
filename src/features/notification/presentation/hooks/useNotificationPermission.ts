import { useCallback, useEffect, useState } from 'react';

import type { NotificationPermissionStatus } from '@/src/core/domain/ports/NotificationPort';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useNotificationPermission() {
  const container = useAppContainer();
  const [status, setStatus] = useState<NotificationPermissionStatus>('undetermined');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await container.notificationPort.getPermissionStatus();
    setStatus(next);
    setLoading(false);
  }, [container]);

  const request = useCallback(async () => {
    const next = await container.notificationPort.requestPermission();
    setStatus(next);
    if (next === 'granted') {
      await container.rescheduleAllReminders.execute();
    }
    return next;
  }, [container]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, loading, refresh, request };
}
