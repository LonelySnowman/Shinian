import { addMonths, addWeeks, addYears, format, startOfDay } from 'date-fns';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type { NotificationIntent } from '@/src/core/domain/ports/NotificationPort';
import { lunarMetaToSolar } from '@/src/core/domain/value-objects/LunarDate';
import type { ReminderRule } from '@/src/core/domain/value-objects/ReminderRule';
import { parseIsoDate } from '@/src/core/utils/dates';

export const SCHEDULE_YEARS = 2;

export function buildNotificationId(
  anniversaryId: string,
  reminderIndex: number,
  occurrence: Date,
): string {
  return `${anniversaryId}:${reminderIndex}:${format(occurrence, 'yyyyMMdd')}`;
}

export function planReminderNotifications(
  anniversary: Anniversary,
  referenceDate: Date = new Date(),
  yearsAhead = SCHEDULE_YEARS,
): NotificationIntent[] {
  if (anniversary.archived || anniversary.deletedAt) {
    return [];
  }

  const windowEnd = addYears(referenceDate, yearsAhead);
  const occurrences = getOccurrencesInWindow(anniversary, referenceDate, windowEnd);
  const intents: NotificationIntent[] = [];

  anniversary.reminders.forEach((reminder, reminderIndex) => {
    if (!reminder.enabled) {
      return;
    }

    occurrences.forEach((occurrence) => {
      const triggerAt = applyReminderOffset(occurrence, reminder);
      if (triggerAt.getTime() <= referenceDate.getTime()) {
        return;
      }

      intents.push({
        id: buildNotificationId(anniversary.id, reminderIndex, occurrence),
        anniversaryId: anniversary.id,
        title: '时念提醒',
        body: buildReminderBody(anniversary.title, occurrence, reminder),
        triggerAt,
        data: {
          anniversaryId: anniversary.id,
          type: 'reminder',
        },
      });
    });
  });

  return intents;
}

function buildReminderBody(title: string, occurrence: Date, reminder: ReminderRule): string {
  if (reminder.offsetDays === 0) {
    return `今天是「${title}」`;
  }

  if (reminder.offsetDays < 0) {
    return `「${title}」还有 ${Math.abs(reminder.offsetDays)} 天`;
  }

  return `「${title}」将在 ${format(occurrence, 'M月d日')} 到来`;
}

function applyReminderOffset(occurrence: Date, reminder: ReminderRule): Date {
  const [hours, minutes] = reminder.timeOfDay.split(':').map(Number);
  const trigger = startOfDay(occurrence);
  trigger.setDate(trigger.getDate() + reminder.offsetDays);
  trigger.setHours(hours, minutes, 0, 0);
  return trigger;
}

function getOccurrencesInWindow(anniversary: Anniversary, from: Date, to: Date): Date[] {
  const anchor = parseIsoDate(anniversary.date);
  const start = startOfDay(from);
  const end = startOfDay(to);
  const results: Date[] = [];

  switch (anniversary.repeatRule.type) {
    case 'none': {
      const occurrence = startOfDay(anchor);
      if (occurrence >= start && occurrence <= end) {
        results.push(occurrence);
      }
      break;
    }
    case 'yearly': {
      for (let year = start.getFullYear(); year <= end.getFullYear() + 1; year += 1) {
        const occurrence = getYearlyOccurrence(anniversary, anchor, year);
        if (occurrence >= start && occurrence <= end) {
          results.push(occurrence);
        }
      }
      break;
    }
    case 'monthly': {
      let cursor = startOfDay(
        new Date(start.getFullYear(), start.getMonth(), anchor.getDate()),
      );
      if (cursor < start) {
        cursor = addMonths(cursor, 1);
      }
      while (cursor <= end) {
        results.push(cursor);
        cursor = addMonths(cursor, 1);
      }
      break;
    }
    case 'weekly': {
      let cursor = startOfDay(anchor);
      while (cursor < start) {
        cursor = addWeeks(cursor, 1);
      }
      while (cursor <= end) {
        results.push(cursor);
        cursor = addWeeks(cursor, 1);
      }
      break;
    }
  }

  return results;
}

function getYearlyOccurrence(anniversary: Anniversary, anchor: Date, year: number): Date {
  if (anniversary.isLunar && anniversary.lunarMeta) {
    return startOfDay(lunarMetaToSolar(anniversary.lunarMeta, year));
  }

  return startOfDay(new Date(year, anchor.getMonth(), anchor.getDate()));
}
