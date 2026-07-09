import { Platform } from 'react-native';
import { createMMKV, type MMKV } from 'react-native-mmkv';

import type { KeyValueStore } from './KeyValueStore';

class MmkvStoreAdapter implements KeyValueStore {
  constructor(private readonly mmkv: MMKV) {}

  getString(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  setString(key: string, value: string): void {
    this.mmkv.set(key, value);
  }

  getNumber(key: string): number | undefined {
    return this.mmkv.getNumber(key);
  }

  setNumber(key: string, value: number): void {
    this.mmkv.set(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return this.mmkv.getBoolean(key);
  }

  setBoolean(key: string, value: boolean): void {
    this.mmkv.set(key, value);
  }

  delete(key: string): void {
    this.mmkv.remove(key);
  }

  contains(key: string): boolean {
    return this.mmkv.contains(key);
  }

  getAllKeys(): string[] {
    return this.mmkv.getAllKeys();
  }
}

class WebStoreAdapter implements KeyValueStore {
  private readonly prefix: string;

  constructor(instanceId: string) {
    this.prefix = `sena:${instanceId}:`;
  }

  private key(key: string): string {
    return `${this.prefix}${key}`;
  }

  getString(key: string): string | undefined {
    const value = globalThis.localStorage?.getItem(this.key(key));
    return value ?? undefined;
  }

  setString(key: string, value: string): void {
    globalThis.localStorage?.setItem(this.key(key), value);
  }

  getNumber(key: string): number | undefined {
    const raw = this.getString(key);
    if (raw === undefined) {
      return undefined;
    }
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  setNumber(key: string, value: number): void {
    this.setString(key, String(value));
  }

  getBoolean(key: string): boolean | undefined {
    const raw = this.getString(key);
    if (raw === undefined) {
      return undefined;
    }
    return raw === 'true';
  }

  setBoolean(key: string, value: boolean): void {
    this.setString(key, String(value));
  }

  delete(key: string): void {
    globalThis.localStorage?.removeItem(this.key(key));
  }

  contains(key: string): boolean {
    return globalThis.localStorage?.getItem(this.key(key)) !== null;
  }

  getAllKeys(): string[] {
    if (!globalThis.localStorage) {
      return [];
    }

    const keys: string[] = [];
    for (let index = 0; index < globalThis.localStorage.length; index += 1) {
      const storageKey = globalThis.localStorage.key(index);
      if (storageKey?.startsWith(this.prefix)) {
        keys.push(storageKey.slice(this.prefix.length));
      }
    }
    return keys;
  }
}

const instances = new Map<string, KeyValueStore>();

export function getKeyValueStore(instanceId: string): KeyValueStore {
  const cached = instances.get(instanceId);
  if (cached) {
    return cached;
  }

  const store =
    Platform.OS === 'web'
      ? new WebStoreAdapter(instanceId)
      : new MmkvStoreAdapter(createMMKV({ id: instanceId }));

  instances.set(instanceId, store);
  return store;
}

export const dataStore = () => getKeyValueStore('sena.data');
export const metaStore = () => getKeyValueStore('sena.meta');
