export interface KeyValueStore {
  getString(key: string): string | undefined;
  setString(key: string, value: string): void;
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
  getBoolean(key: string): boolean | undefined;
  setBoolean(key: string, value: boolean): void;
  delete(key: string): void;
  contains(key: string): boolean;
  getAllKeys(): string[];
}

export interface KeyValueStoreFactory {
  instance(id: string): KeyValueStore;
}
