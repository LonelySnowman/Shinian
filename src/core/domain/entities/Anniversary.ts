import type { LunarMeta } from '../value-objects/LunarDate';
import type { ReminderRule } from '../value-objects/ReminderRule';
import type { RepeatRule } from '../value-objects/RepeatRule';
import { DEFAULT_REPEAT_RULE, normalizeRepeatRule } from '../value-objects/RepeatRule';
import { DEFAULT_REMINDERS, normalizeReminders } from '../value-objects/ReminderRule';

export interface CalendarSyncMeta {
  enabled: boolean;
  externalEventId?: string;
  calendarId?: string;
  lastSyncedAt?: string;
}

export interface Anniversary {
  id: string;
  title: string;
  date: string;
  isLunar: boolean;
  lunarMeta?: LunarMeta;
  repeatRule: RepeatRule;
  reminders: ReminderRule[];
  categoryId: string;
  icon: string;
  color: string;
  notes?: string;
  archived: boolean;
  archivedAt?: string;
  calendarSync?: CalendarSyncMeta;
  notificationIds?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  syncVersion: number;
}

export type CreateAnniversaryInput = {
  title: string;
  date: Date;
  isLunar?: boolean;
  lunarMeta?: LunarMeta;
  repeatRule?: RepeatRule;
  reminders?: ReminderRule[];
  categoryId: string;
  icon?: string;
  color?: string;
  notes?: string;
  calendarSyncEnabled?: boolean;
};

export type UpdateAnniversaryInput = Partial<
  Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt' | 'syncVersion' | 'deletedAt' | 'date'>
> & {
  date?: Date;
};

export function createAnniversaryEntity(
  input: CreateAnniversaryInput & { id: string; now: string },
): Anniversary {
  return {
    id: input.id,
    title: input.title.trim(),
    date: input.date.toISOString(),
    isLunar: input.isLunar ?? false,
    lunarMeta: input.lunarMeta,
    repeatRule: normalizeRepeatRule(input.repeatRule),
    reminders: normalizeReminders(input.reminders),
    categoryId: input.categoryId,
    icon: input.icon ?? 'heart',
    color: input.color ?? '#6366F1',
    notes: input.notes?.trim() || undefined,
    archived: false,
    calendarSync: { enabled: input.calendarSyncEnabled ?? false },
    notificationIds: [],
    createdAt: input.now,
    updatedAt: input.now,
    syncVersion: 1,
  };
}

export function applyAnniversaryUpdate(
  current: Anniversary,
  input: UpdateAnniversaryInput,
  now: string,
): Anniversary {
  return {
    ...current,
    ...input,
    title: input.title !== undefined ? input.title.trim() : current.title,
    date: input.date !== undefined ? input.date.toISOString() : current.date,
    repeatRule:
      input.repeatRule !== undefined
        ? normalizeRepeatRule(input.repeatRule)
        : current.repeatRule,
    reminders:
      input.reminders !== undefined
        ? normalizeReminders(input.reminders)
        : current.reminders,
    notes: input.notes !== undefined ? input.notes.trim() || undefined : current.notes,
    updatedAt: now,
    syncVersion: current.syncVersion + 1,
  };
}

export const DEFAULT_ANNIVERSARY_COLOR = '#6366F1';
export const DEFAULT_ANNIVERSARY_ICON = 'heart';
export { DEFAULT_REPEAT_RULE, DEFAULT_REMINDERS };
