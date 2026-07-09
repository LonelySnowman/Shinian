import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInYears,
  startOfDay,
} from 'date-fns';

export function toStartOfDay(date: Date): Date {
  return startOfDay(date);
}

export function parseIsoDate(value: string): Date {
  return new Date(value);
}

export function getDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}-${day}`;
}

export function getCalendarDiff(from: Date, to: Date) {
  return {
    days: differenceInCalendarDays(to, from),
    weeks: differenceInCalendarWeeks(to, from),
    months: differenceInCalendarMonths(to, from),
    years: differenceInYears(to, from),
  };
}
