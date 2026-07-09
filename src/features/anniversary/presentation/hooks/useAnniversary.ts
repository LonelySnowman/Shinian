import { useCallback, useEffect, useState } from 'react';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useAnniversary(id?: string) {
  const container = useAppContainer();
  const [item, setItem] = useState<Anniversary | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  const refresh = useCallback(async () => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const record = await container.getAnniversaryById.execute(id);
    setItem(record);
    setLoading(false);
  }, [container, id]);

  useEffect(() => {
    refresh();
    const unsubscribe = container.anniversaryRepository.subscribe(() => {
      refresh();
    });
    return unsubscribe;
  }, [container, refresh]);

  return { item, loading, refresh };
}
