import { useCallback, useEffect, useState } from 'react';

import type { Category } from '@/src/core/domain/entities/Category';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export function useCategories() {
  const container = useAppContainer();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const records = await container.categoryRepository.findAll();
    setItems(records);
    setLoading(false);
  }, [container]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}
