import type { UserPreferences } from '@/src/core/domain/entities/UserPreferences';
import { DEFAULT_USER_PREFERENCES } from '@/src/core/domain/entities/UserPreferences';
import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';

import { getDataStore, readJson, STORAGE_KEYS, writeJson } from '../mmkv/client';

export class MmkvPreferencesRepository implements PreferencesRepository {
  async get(): Promise<UserPreferences> {
    return (
      readJson<UserPreferences>(getDataStore(), STORAGE_KEYS.preferences) ??
      DEFAULT_USER_PREFERENCES
    );
  }

  async save(preferences: UserPreferences): Promise<void> {
    writeJson(getDataStore(), STORAGE_KEYS.preferences, preferences);
  }
}
