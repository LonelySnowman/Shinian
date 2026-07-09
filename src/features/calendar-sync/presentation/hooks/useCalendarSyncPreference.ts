import { useCallback, useEffect, useState } from 'react';

import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useCalendarSyncPreference() {
  const container = useAppContainer();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const preferences = await container.preferencesRepository.get();
    setEnabled(preferences.calendarSyncEnabled);
    setLoading(false);
  }, [container]);

  const setCalendarSyncEnabled = useCallback(
    async (nextEnabled: boolean) => {
      setEnabled(nextEnabled);
      await container.updateCalendarSyncPreference.execute(nextEnabled);
    },
    [container],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { enabled, loading, refresh, setCalendarSyncEnabled };
}
