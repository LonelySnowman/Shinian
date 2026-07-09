import { Lunar, Solar } from 'lunar-javascript';

export interface LunarMeta {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

export function solarToLunarMeta(date: Date): LunarMeta {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  return {
    year: lunar.getYear(),
    month: Math.abs(lunar.getMonth()),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0,
  };
}

export function lunarMetaToSolar(meta: LunarMeta, referenceYear?: number): Date {
  const year = referenceYear ?? new Date().getFullYear();
  const month = meta.isLeapMonth ? -meta.month : meta.month;
  const lunar = Lunar.fromYmd(year, month, meta.day);
  const solar = lunar.getSolar();
  return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
}

export function resolveOccurrenceDate(
  anchorDate: Date,
  isLunar: boolean,
  lunarMeta: LunarMeta | undefined,
  referenceDate: Date,
): Date {
  if (!isLunar || !lunarMeta) {
    return anchorDate;
  }

  const year = referenceDate.getFullYear();
  let occurrence = lunarMetaToSolar(lunarMeta, year);

  if (occurrence < startOfDay(referenceDate)) {
    occurrence = lunarMetaToSolar(lunarMeta, year + 1);
  }

  return occurrence;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}
