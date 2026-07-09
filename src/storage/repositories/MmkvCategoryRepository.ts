import type { Category } from '@/src/core/domain/entities/Category';
import type { CategoryRepository } from '@/src/core/domain/ports/CategoryRepository';
import { DEFAULT_CATEGORIES } from '@/src/core/domain/entities/Category';

import {
  getDataStore,
  readJson,
  readStringArray,
  STORAGE_KEYS,
  writeJson,
  writeStringArray,
} from '../mmkv/client';

export class MmkvCategoryRepository implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return readJson<Category>(getDataStore(), STORAGE_KEYS.categoryRecord(id));
  }

  async findAll(): Promise<Category[]> {
    const store = getDataStore();
    return readStringArray(store, STORAGE_KEYS.categoryIds)
      .map((id) => readJson<Category>(store, STORAGE_KEYS.categoryRecord(id)))
      .filter((category): category is Category => Boolean(category))
      .sort((left, right) => left.sortOrder - right.sortOrder);
  }

  async save(category: Category): Promise<void> {
    const store = getDataStore();
    writeJson(store, STORAGE_KEYS.categoryRecord(category.id), category);

    const ids = readStringArray(store, STORAGE_KEYS.categoryIds);
    if (!ids.includes(category.id)) {
      writeStringArray(store, STORAGE_KEYS.categoryIds, [...ids, category.id]);
    }
  }

  async delete(id: string): Promise<void> {
    const store = getDataStore();
    store.delete(STORAGE_KEYS.categoryRecord(id));
    writeStringArray(
      store,
      STORAGE_KEYS.categoryIds,
      readStringArray(store, STORAGE_KEYS.categoryIds).filter((item) => item !== id),
    );
  }

  async seedDefaults(now: string): Promise<void> {
    const store = getDataStore();
    const existing = readStringArray(store, STORAGE_KEYS.categoryIds);
    if (existing.length > 0) {
      return;
    }

    const ids: string[] = [];
    DEFAULT_CATEGORIES.forEach((category) => {
      writeJson(store, STORAGE_KEYS.categoryRecord(category.id), {
        ...category,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(category.id);
    });
    writeStringArray(store, STORAGE_KEYS.categoryIds, ids);
  }
}
