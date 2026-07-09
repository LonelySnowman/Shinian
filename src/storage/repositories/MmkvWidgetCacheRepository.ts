import type { WidgetCacheRepository, WidgetSnapshotProps } from '@/src/core/domain/ports/WidgetPort';

import { getDataStore, readJson, writeJson } from '../mmkv/client';

const WIDGET_CACHE_KEY = 'cache/widget_snapshot';

export class MmkvWidgetCacheRepository implements WidgetCacheRepository {
  async get(): Promise<WidgetSnapshotProps | null> {
    return readJson<WidgetSnapshotProps>(getDataStore(), WIDGET_CACHE_KEY);
  }

  async save(snapshot: WidgetSnapshotProps): Promise<void> {
    writeJson(getDataStore(), WIDGET_CACHE_KEY, snapshot);
  }
}
