import { startOfDay } from 'date-fns';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type {
  CalendarEventPayload,
  CalendarRecurrenceRule,
} from '@/src/core/domain/ports/CalendarPort';
import { lunarMetaToSolar } from '@/src/core/domain/value-objects/LunarDate';
import type { RepeatRule } from '@/src/core/domain/value-objects/RepeatRule';
import { parseIsoDate } from '@/src/core/utils/dates';

const APP_SCHEME = 'sena';

export function mapAnniversaryToCalendarEvent(anniversary: Anniversary): CalendarEventPayload {
  const startDate = getCalendarSyncStartDate(anniversary);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  return {
    title: `时念 · ${anniversary.title}`,
    startDate,
    endDate,
    allDay: true,
    notes: buildCalendarNotes(anniversary),
    recurrenceRule: mapRecurrenceRule(anniversary.repeatRule),
  };
}

function getCalendarSyncStartDate(anniversary: Anniversary): Date {
  const anchor = parseIsoDate(anniversary.date);
  const today = startOfDay(new Date());

  if (
    anniversary.repeatRule.type === 'yearly' &&
    anniversary.isLunar &&
    anniversary.lunarMeta
  ) {
    return startOfDay(lunarMetaToSolar(anniversary.lunarMeta, today.getFullYear()));
  }

  return startOfDay(anchor);
}

function mapRecurrenceRule(repeatRule: RepeatRule): CalendarRecurrenceRule | null {
  switch (repeatRule.type) {
    case 'yearly':
      return { frequency: 'yearly', interval: 1 };
    case 'monthly':
      return { frequency: 'monthly', interval: 1 };
    case 'weekly':
      return { frequency: 'weekly', interval: 1 };
    case 'none':
    default:
      return null;
  }
}

function buildCalendarNotes(anniversary: Anniversary): string {
  const lines = [`sena://anniversary/${anniversary.id}`];
  if (anniversary.notes) {
    lines.push('', anniversary.notes);
  }
  if (anniversary.isLunar) {
    lines.push('', '（农历纪念日，时念会在每年自动更新公历日期）');
  }
  return lines.join('\n');
}

export function shouldSyncAnniversary(
  anniversary: Anniversary,
  globalEnabled: boolean,
): boolean {
  return (
    globalEnabled &&
    Boolean(anniversary.calendarSync?.enabled) &&
    !anniversary.archived &&
    !anniversary.deletedAt
  );
}
