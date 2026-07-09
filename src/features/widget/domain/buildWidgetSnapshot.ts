import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type { WidgetSnapshotItem, WidgetSnapshotProps } from '@/src/core/domain/ports/WidgetPort';
import {
  computeCountdown,
  compareByUpcoming,
  formatCountdownPrimary,
  formatCountdownSubtitle,
} from '@/src/features/countdown';

export const WIDGET_SNAPSHOT_VERSION = 1;
export const WIDGET_MAX_ITEMS = 7;

export function buildWidgetSnapshot(
  anniversaries: Anniversary[],
  referenceDate: Date = new Date(),
): WidgetSnapshotProps {
  const items = anniversaries
    .filter((item) => !item.archived && !item.deletedAt)
    .sort(compareByUpcoming)
    .slice(0, WIDGET_MAX_ITEMS)
    .map((anniversary) => mapAnniversaryToWidgetItem(anniversary, referenceDate));

  return {
    version: WIDGET_SNAPSHOT_VERSION,
    generatedAt: referenceDate.toISOString(),
    items,
  };
}

function mapAnniversaryToWidgetItem(
  anniversary: Anniversary,
  referenceDate: Date,
): WidgetSnapshotItem {
  const countdown = computeCountdown(anniversary, referenceDate);

  return {
    id: anniversary.id,
    title: anniversary.title,
    color: anniversary.color,
    daysRemaining: countdown.days,
    primaryLabel: formatCountdownPrimary(countdown),
    secondaryLabel: formatCountdownSubtitle(countdown),
    targetDateIso: countdown.nextOccurrence.toISOString(),
  };
}

export function getVisibleWidgetItems(
  snapshot: WidgetSnapshotProps,
  family: 'systemSmall' | 'systemMedium' | 'systemLarge' | string,
): WidgetSnapshotItem[] {
  switch (family) {
    case 'systemSmall':
      return snapshot.items.slice(0, 1);
    case 'systemMedium':
      return snapshot.items.slice(0, 3);
    case 'systemLarge':
      return snapshot.items.slice(0, 7);
    default:
      return snapshot.items.slice(0, 3);
  }
}
