import type { KeyValueStore } from '../kv/KeyValueStore';
import { dataStore, metaStore } from '../kv/createKeyValueStore';

export const STORAGE_KEYS = {
  schemaVersion: 'meta/schema_version',
  anniversaryIds: 'anniversary:ids',
  anniversaryArchivedIds: 'anniversary:archived_ids',
  anniversaryRecord: (id: string) => `anniversary:${id}`,
  categoryIds: 'category:ids',
  categoryRecord: (id: string) => `category:${id}`,
  preferences: 'preferences',
} as const;

export const CURRENT_SCHEMA_VERSION = 1;

export function getDataStore(): KeyValueStore {
  return dataStore();
}

export function getMetaStore(): KeyValueStore {
  return metaStore();
}

export function readJson<T>(store: KeyValueStore, key: string): T | null {
  const raw = store.getString(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson(store: KeyValueStore, key: string, value: unknown): void {
  store.setString(key, JSON.stringify(value));
}

export function readStringArray(store: KeyValueStore, key: string): string[] {
  return readJson<string[]>(store, key) ?? [];
}

export function writeStringArray(store: KeyValueStore, key: string, value: string[]): void {
  writeJson(store, key, value);
}
