import { DEFAULT_CATEGORIES } from '@/src/core/domain/entities/Category';
import { DEFAULT_USER_PREFERENCES } from '@/src/core/domain/entities/UserPreferences';
import { createId, nowIso } from '@/src/core/utils/id';

import {
  getDataStore,
  readStringArray,
  STORAGE_KEYS,
  writeJson,
  writeStringArray,
} from '../mmkv/client';

export const initialMigration = {
  version: 1,
  up: async () => {
    const store = getDataStore();
    const now = nowIso();

    if (readStringArray(store, STORAGE_KEYS.categoryIds).length === 0) {
      const categoryIds: string[] = [];
      DEFAULT_CATEGORIES.forEach((category) => {
        writeJson(store, STORAGE_KEYS.categoryRecord(category.id), {
          ...category,
          createdAt: now,
          updatedAt: now,
        });
        categoryIds.push(category.id);
      });
      writeStringArray(store, STORAGE_KEYS.categoryIds, categoryIds);
    }

    if (!store.contains(STORAGE_KEYS.preferences)) {
      writeJson(store, STORAGE_KEYS.preferences, {
        ...DEFAULT_USER_PREFERENCES,
        updatedAt: now,
      });
    }

    if (!readStringArray(store, STORAGE_KEYS.anniversaryIds).length) {
      writeStringArray(store, STORAGE_KEYS.anniversaryIds, []);
      writeStringArray(store, STORAGE_KEYS.anniversaryArchivedIds, []);
    }

    // Reserved for future sample data seeding.
    void createId();
  },
};
