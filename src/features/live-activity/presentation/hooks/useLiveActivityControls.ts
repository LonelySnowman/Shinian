import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useLiveActivityControls(anniversaryId?: string) {
  const container = useAppContainer();
  const [activeAnniversaryId, setActiveAnniversaryId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const preferences = await container.preferencesRepository.get();
    setActiveAnniversaryId(preferences.activeLiveActivityAnniversaryId);
    setLoading(false);
  }, [container]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const start = useCallback(async () => {
    if (!anniversaryId) {
      return;
    }

    setBusy(true);
    try {
      await container.startLiveActivity.execute(anniversaryId);
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [anniversaryId, container, refresh]);

  const end = useCallback(async () => {
    setBusy(true);
    try {
      await container.endLiveActivity.execute();
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [container, refresh]);

  return {
    supported: Platform.OS === 'ios' && container.liveActivityPort.isSupported(),
    isActiveForCurrent: Boolean(anniversaryId && activeAnniversaryId === anniversaryId),
    activeAnniversaryId,
    loading,
    busy,
    start,
    end,
    refresh,
  };
}
