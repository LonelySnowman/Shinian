import { useCallback, useEffect, useState } from 'react';

import type { CalendarPermissionStatus } from '@/src/core/domain/ports/CalendarPort';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useCalendarPermission() {
  const container = useAppContainer();
  const [status, setStatus] = useState<CalendarPermissionStatus>('undetermined');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await container.calendarPort.getPermissionStatus();
    setStatus(next);
    setLoading(false);
  }, [container]);

  const request = useCallback(async () => {
    const next = await container.calendarPort.requestPermission();
    setStatus(next);
    if (next === 'granted') {
      await container.reconcileCalendarEvents.execute();
    }
    return next;
  }, [container]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, loading, refresh, request };
}
