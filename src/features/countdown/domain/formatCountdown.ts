import type { CountdownResult } from './computeCountdown';

export type CountdownDisplayUnit = 'days' | 'weeks' | 'months' | 'years';

export function formatCountdownPrimary(countdown: CountdownResult): string {
  if (countdown.days === 0) {
    return '今天';
  }

  const prefix = countdown.mode === 'remaining' ? '' : '已 ';
  return `${prefix}${countdown.days}`;
}

export function formatCountdownUnit(countdown: CountdownResult): string {
  if (countdown.days === 0) {
    return '';
  }
  return countdown.mode === 'remaining' ? '天' : '天前';
}

export function formatCountdownDetail(
  countdown: CountdownResult,
  unit: CountdownDisplayUnit = 'days',
): string {
  switch (unit) {
    case 'weeks':
      return `${countdown.weeks} 周`;
    case 'months':
      return `${countdown.months} 个月`;
    case 'years':
      return `${countdown.years} 年`;
    case 'days':
    default:
      return `${countdown.days} 天`;
  }
}

export function formatCountdownSubtitle(countdown: CountdownResult): string {
  return countdown.label;
}
