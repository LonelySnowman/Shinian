export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt' | 'updatedAt'>[] = [
  { id: 'cat-birthday', name: '生日', icon: 'gift', color: '#F97316', sortOrder: 0, isDefault: true },
  { id: 'cat-love', name: '恋爱', icon: 'heart', color: '#EC4899', sortOrder: 1, isDefault: true },
  { id: 'cat-wedding', name: '结婚', icon: 'rings', color: '#8B5CF6', sortOrder: 2, isDefault: true },
  { id: 'cat-work', name: '工作', icon: 'briefcase', color: '#3B82F6', sortOrder: 3, isDefault: true },
  { id: 'cat-other', name: '其他', icon: 'star', color: '#64748B', sortOrder: 4, isDefault: true },
];

export const DEFAULT_CATEGORY_ID = 'cat-other';
