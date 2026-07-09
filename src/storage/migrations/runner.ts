import {
  CURRENT_SCHEMA_VERSION,
  getMetaStore,
  readJson,
  writeJson,
} from '../mmkv/client';

export interface Migration {
  version: number;
  up: () => Promise<void> | void;
}

export async function runMigrations(migrations: Migration[]): Promise<void> {
  const meta = getMetaStore();
  const currentVersion = meta.getNumber('meta/schema_version') ?? 0;

  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await migration.up();
    meta.setNumber('meta/schema_version', migration.version);
  }

  if (currentVersion === 0 && pending.length === 0) {
    meta.setNumber('meta/schema_version', CURRENT_SCHEMA_VERSION);
  }
}

export function getAppliedMigrations(): number[] {
  return readJson<number[]>(getMetaStore(), 'meta/migrations_applied') ?? [];
}

export function markMigrationApplied(version: number): void {
  const applied = getAppliedMigrations();
  if (!applied.includes(version)) {
    writeJson(getMetaStore(), 'meta/migrations_applied', [...applied, version]);
  }
}
