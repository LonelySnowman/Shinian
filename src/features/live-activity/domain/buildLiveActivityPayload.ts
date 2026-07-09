import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type { LiveActivityPayload } from '@/src/core/domain/ports/LiveActivityPort';
import {
  computeCountdown,
  formatCountdownPrimary,
  formatCountdownSubtitle,
} from '@/src/features/countdown';

export function buildLiveActivityPayload(anniversary: Anniversary): LiveActivityPayload {
  const countdown = computeCountdown(anniversary);

  return {
    anniversaryId: anniversary.id,
    title: anniversary.title,
    color: anniversary.color,
    primaryLabel: formatCountdownPrimary(countdown),
    secondaryLabel: formatCountdownSubtitle(countdown),
  };
}

export function buildLiveActivityDeepLink(anniversaryId: string): string {
  return `sena://anniversary/${anniversaryId}`;
}
