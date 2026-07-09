import type { Anniversary } from '../entities/Anniversary';

export type AnniversarySortField = 'date' | 'title' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface AnniversaryQuery {
  includeArchived?: boolean;
  categoryId?: string;
  search?: string;
  sortBy?: AnniversarySortField;
  sortDirection?: SortDirection;
}

export type AnniversaryChangeListener = () => void;

export interface AnniversaryRepository {
  findById(id: string): Promise<Anniversary | null>;
  findAll(query?: AnniversaryQuery): Promise<Anniversary[]>;
  save(anniversary: Anniversary): Promise<void>;
  delete(id: string): Promise<void>;
  archive(id: string, archivedAt: string): Promise<void>;
  restore(id: string): Promise<void>;
  subscribe(listener: AnniversaryChangeListener): () => void;
}
