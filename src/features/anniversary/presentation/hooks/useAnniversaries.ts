import { useCallback, useEffect, useState } from 'react';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import { compareByUpcoming } from '@/src/features/countdown';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useAnniversaries(includeArchived = false) {
  const container = useAppContainer();
  const [items, setItems] = useState<Anniversary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const records = await container.getAnniversaries.execute(includeArchived);
    setItems(records.sort(compareByUpcoming));
    setLoading(false);
  }, [container, includeArchived]);

  useEffect(() => {
    refresh();
    const unsubscribe = container.anniversaryRepository.subscribe(() => {
      refresh();
    });
    return unsubscribe;
  }, [container, refresh]);

  return { items, loading, refresh };
}
