import { useCallback, useEffect, useState } from 'react';

import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useOnboardingStatus() {
  const container = useAppContainer();
  const [hasOnboarded, setHasOnboarded] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const preferences = await container.preferencesRepository.get();
    setHasOnboarded(preferences.hasOnboarded);
    setLoading(false);
  }, [container]);

  const complete = useCallback(async () => {
    await container.completeOnboarding.execute();
    await refresh();
  }, [container, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { hasOnboarded, loading, refresh, complete };
}
