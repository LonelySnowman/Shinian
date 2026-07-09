import { addYears, differenceInCalendarDays, startOfDay } from 'date-fns';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import { resolveOccurrenceDate } from '@/src/core/domain/value-objects/LunarDate';
import type { RepeatRule } from '@/src/core/domain/value-objects/RepeatRule';
import { parseIsoDate, getCalendarDiff } from '@/src/core/utils/dates';

export type CountdownMode = 'remaining' | 'elapsed';

export interface CountdownResult {
  mode: CountdownMode;
  days: number;
  weeks: number;
  months: number;
  years: number;
  nextOccurrence: Date;
  anchorDate: Date;
  label: string;
}

export function computeCountdown(
  anniversary: Anniversary,
  referenceDate: Date = new Date(),
): CountdownResult {
  const anchorDate = parseIsoDate(anniversary.date);
  const repeatRule = anniversary.repeatRule;
  const today = startOfDay(referenceDate);

  if (repeatRule.type === 'none') {
    return buildResult(anchorDate, today, 'none');
  }

  const nextOccurrence = getNextOccurrence(anniversary, today);
  return buildResult(nextOccurrence, today, repeatRule.type, anchorDate);
}

function getNextOccurrence(anniversary: Anniversary, today: Date): Date {
  const anchorDate = parseIsoDate(anniversary.date);
  const repeatRule = anniversary.repeatRule;

  if (repeatRule.type === 'yearly') {
    if (anniversary.isLunar && anniversary.lunarMeta) {
      return startOfDay(
        resolveOccurrenceDate(anchorDate, true, anniversary.lunarMeta, today),
      );
    }

    let candidate = startOfDay(
      new Date(today.getFullYear(), anchorDate.getMonth(), anchorDate.getDate()),
    );
    if (candidate < today) {
      candidate = startOfDay(addYears(candidate, 1));
    }
    return candidate;
  }

  if (repeatRule.type === 'monthly') {
    let candidate = startOfDay(
      new Date(today.getFullYear(), today.getMonth(), anchorDate.getDate()),
    );
    if (candidate < today) {
      candidate = startOfDay(
        new Date(today.getFullYear(), today.getMonth() + 1, anchorDate.getDate()),
      );
    }
    return candidate;
  }

  if (repeatRule.type === 'weekly') {
    const dayDiff = (anchorDate.getDay() - today.getDay() + 7) % 7;
    const candidate = startOfDay(new Date(today));
    candidate.setDate(candidate.getDate() + (dayDiff === 0 ? 0 : dayDiff));
    if (candidate < today) {
      candidate.setDate(candidate.getDate() + 7);
    }
    return candidate;
  }

  return startOfDay(anchorDate);
}

function buildResult(
  targetDate: Date,
  today: Date,
  repeatType: RepeatRule['type'],
  anchorDate?: Date,
): CountdownResult {
  const normalizedTarget = startOfDay(targetDate);
  const diffDays = differenceInCalendarDays(normalizedTarget, today);
  const mode: CountdownMode = diffDays >= 0 ? 'remaining' : 'elapsed';
  const absoluteDays = Math.abs(diffDays);
  const calendarDiff = getCalendarDiff(
    mode === 'remaining' ? today : normalizedTarget,
    mode === 'remaining' ? normalizedTarget : today,
  );

  return {
    mode,
    days: absoluteDays,
    weeks: Math.floor(absoluteDays / 7),
    months: calendarDiff.months,
    years: calendarDiff.years,
    nextOccurrence: normalizedTarget,
    anchorDate: anchorDate ?? normalizedTarget,
    label: buildLabel(mode, absoluteDays, repeatType),
  };
}

function buildLabel(mode: CountdownMode, days: number, repeatType: RepeatRule['type']): string {
  if (days === 0) {
    return '就是今天';
  }

  if (mode === 'remaining') {
    if (repeatType === 'none') {
      return `还有 ${days} 天`;
    }
    return `还有 ${days} 天`;
  }

  return `已过去 ${days} 天`;
}

export function compareByUpcoming(
  left: Anniversary,
  right: Anniversary,
  referenceDate: Date = new Date(),
): number {
  return (
    computeCountdown(left, referenceDate).nextOccurrence.getTime() -
    computeCountdown(right, referenceDate).nextOccurrence.getTime()
  );
}
