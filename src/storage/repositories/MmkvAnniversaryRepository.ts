import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type {
  AnniversaryChangeListener,
  AnniversaryQuery,
  AnniversaryRepository,
} from '@/src/core/domain/ports/AnniversaryRepository';
import { getDateKey, parseIsoDate } from '@/src/core/utils/dates';

import {
  getDataStore,
  readJson,
  readStringArray,
  STORAGE_KEYS,
  writeJson,
  writeStringArray,
} from '../mmkv/client';

export class MmkvAnniversaryRepository implements AnniversaryRepository {
  private readonly listeners = new Set<AnniversaryChangeListener>();

  subscribe(listener: AnniversaryChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  async findById(id: string): Promise<Anniversary | null> {
    const record = readJson<Anniversary>(getDataStore(), STORAGE_KEYS.anniversaryRecord(id));
    if (!record || record.deletedAt) {
      return null;
    }
    return record;
  }

  async findAll(query: AnniversaryQuery = {}): Promise<Anniversary[]> {
    const store = getDataStore();
    const activeIds = readStringArray(store, STORAGE_KEYS.anniversaryIds);
    const archivedIds = query.includeArchived
      ? readStringArray(store, STORAGE_KEYS.anniversaryArchivedIds)
      : [];

    const ids = [...activeIds, ...archivedIds];
    const records = ids
      .map((id) => readJson<Anniversary>(store, STORAGE_KEYS.anniversaryRecord(id)))
      .filter((record): record is Anniversary => Boolean(record && !record.deletedAt))
      .filter((record) => (query.includeArchived ? true : !record.archived))
      .filter((record) => (query.categoryId ? record.categoryId === query.categoryId : true))
      .filter((record) => {
        if (!query.search?.trim()) {
          return true;
        }
        const keyword = query.search.trim().toLowerCase();
        return (
          record.title.toLowerCase().includes(keyword) ||
          record.notes?.toLowerCase().includes(keyword)
        );
      });

    return sortAnniversaries(records, query.sortBy ?? 'date', query.sortDirection ?? 'asc');
  }

  async save(anniversary: Anniversary): Promise<void> {
    const store = getDataStore();
    writeJson(store, STORAGE_KEYS.anniversaryRecord(anniversary.id), anniversary);
    this.syncIndexes(anniversary);
    this.notify();
  }

  async delete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      return;
    }

    const deleted: Anniversary = {
      ...existing,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const store = getDataStore();
    writeJson(store, STORAGE_KEYS.anniversaryRecord(id), deleted);
    this.removeFromIndexes(id);
    this.notify();
  }

  async archive(id: string, archivedAt: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      return;
    }

    await this.save({
      ...existing,
      archived: true,
      archivedAt,
      updatedAt: archivedAt,
      syncVersion: existing.syncVersion + 1,
    });
  }

  async restore(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      return;
    }

    await this.save({
      ...existing,
      archived: false,
      archivedAt: undefined,
      updatedAt: new Date().toISOString(),
      syncVersion: existing.syncVersion + 1,
    });
  }

  private syncIndexes(anniversary: Anniversary): void {
    const store = getDataStore();
    const activeIds = readStringArray(store, STORAGE_KEYS.anniversaryIds).filter(
      (id) => id !== anniversary.id,
    );
    const archivedIds = readStringArray(store, STORAGE_KEYS.anniversaryArchivedIds).filter(
      (id) => id !== anniversary.id,
    );

    if (anniversary.archived) {
      archivedIds.unshift(anniversary.id);
      writeStringArray(store, STORAGE_KEYS.anniversaryIds, activeIds);
      writeStringArray(store, STORAGE_KEYS.anniversaryArchivedIds, archivedIds);
    } else {
      activeIds.unshift(anniversary.id);
      writeStringArray(store, STORAGE_KEYS.anniversaryIds, activeIds);
      writeStringArray(store, STORAGE_KEYS.anniversaryArchivedIds, archivedIds);
    }
  }

  private removeFromIndexes(id: string): void {
    const store = getDataStore();
    writeStringArray(
      store,
      STORAGE_KEYS.anniversaryIds,
      readStringArray(store, STORAGE_KEYS.anniversaryIds).filter((item) => item !== id),
    );
    writeStringArray(
      store,
      STORAGE_KEYS.anniversaryArchivedIds,
      readStringArray(store, STORAGE_KEYS.anniversaryArchivedIds).filter((item) => item !== id),
    );
  }
}

function sortAnniversaries(
  records: Anniversary[],
  sortBy: NonNullable<AnniversaryQuery['sortBy']>,
  sortDirection: NonNullable<AnniversaryQuery['sortDirection']>,
): Anniversary[] {
  const direction = sortDirection === 'asc' ? 1 : -1;

  return [...records].sort((left, right) => {
    switch (sortBy) {
      case 'title':
        return left.title.localeCompare(right.title, 'zh-CN') * direction;
      case 'createdAt':
        return (Date.parse(left.createdAt) - Date.parse(right.createdAt)) * direction;
      case 'updatedAt':
        return (Date.parse(left.updatedAt) - Date.parse(right.updatedAt)) * direction;
      case 'date':
      default:
        return (
          (getUpcomingSortKey(left).getTime() - getUpcomingSortKey(right).getTime()) * direction
        );
    }
  });
}

function getUpcomingSortKey(anniversary: Anniversary): Date {
  const anchor = parseIsoDate(anniversary.date);
  const now = new Date();
  const monthDay = getDateKey(anchor);
  const [month, day] = monthDay.split('-').map(Number);
  let candidate = new Date(now.getFullYear(), month - 1, day);

  if (candidate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    candidate = new Date(now.getFullYear() + 1, month - 1, day);
  }

  return candidate;
}
