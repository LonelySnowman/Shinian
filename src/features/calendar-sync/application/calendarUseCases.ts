import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import type { CalendarPort } from '@/src/core/domain/ports/CalendarPort';
import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';
import { nowIso } from '@/src/core/utils/id';
import {
  mapAnniversaryToCalendarEvent,
  shouldSyncAnniversary,
} from '@/src/features/calendar-sync/domain/calendarEventMapper';

export class SyncAnniversaryToCalendarUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly calendarPort: CalendarPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    const anniversary = await this.anniversaryRepository.findById(anniversaryId);
    if (!anniversary) {
      return;
    }

    if (anniversary.archived || anniversary.deletedAt) {
      await this.removeExternalEvent(anniversary, anniversary.calendarSync?.enabled ?? false);
      return;
    }

    const preferences = await this.preferencesRepository.get();
    if (!shouldSyncAnniversary(anniversary, preferences.calendarSyncEnabled)) {
      await this.removeExternalEvent(anniversary, false);
      return;
    }

    let permission = await this.calendarPort.getPermissionStatus();
    if (permission === 'undetermined') {
      permission = await this.calendarPort.requestPermission();
    }
    if (permission !== 'granted') {
      return;
    }

    const calendarId =
      anniversary.calendarSync?.calendarId ?? (await this.calendarPort.getDefaultCalendarId());
    if (!calendarId) {
      return;
    }

    const payload = mapAnniversaryToCalendarEvent(anniversary);
    const syncedAt = nowIso();
    let externalEventId = anniversary.calendarSync?.externalEventId;

    if (externalEventId && (await this.calendarPort.eventExists(externalEventId))) {
      await this.calendarPort.updateEvent(externalEventId, payload);
    } else {
      externalEventId = await this.calendarPort.createEvent(calendarId, payload);
    }

    await this.anniversaryRepository.save({
      ...anniversary,
      calendarSync: {
        enabled: true,
        externalEventId,
        calendarId,
        lastSyncedAt: syncedAt,
      },
      updatedAt: syncedAt,
    });
  }

  private async removeExternalEvent(
    anniversary: NonNullable<Awaited<ReturnType<AnniversaryRepository['findById']>>>,
    keepEnabled: boolean,
  ): Promise<void> {
    if (anniversary.calendarSync?.externalEventId) {
      await this.calendarPort.deleteEvent(anniversary.calendarSync.externalEventId);
    }

    const syncedAt = nowIso();
    await this.anniversaryRepository.save({
      ...anniversary,
      calendarSync: {
        enabled: keepEnabled,
        calendarId: anniversary.calendarSync?.calendarId,
        externalEventId: undefined,
        lastSyncedAt: syncedAt,
      },
      updatedAt: syncedAt,
    });
  }
}

export class UnsyncAnniversaryFromCalendarUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly calendarPort: CalendarPort,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    const anniversary = await this.anniversaryRepository.findRecordById(anniversaryId);
    if (!anniversary?.calendarSync?.externalEventId) {
      return;
    }

    await this.calendarPort.deleteEvent(anniversary.calendarSync.externalEventId);
    await this.anniversaryRepository.save({
      ...anniversary,
      calendarSync: {
        ...anniversary.calendarSync,
        enabled: false,
        externalEventId: undefined,
        lastSyncedAt: nowIso(),
      },
      updatedAt: nowIso(),
    });
  }
}

export class ReconcileCalendarEventsUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly syncAnniversary: SyncAnniversaryToCalendarUseCase,
    private readonly calendarPort: CalendarPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(): Promise<void> {
    const preferences = await this.preferencesRepository.get();
    if (!preferences.calendarSyncEnabled) {
      return;
    }

    const permission = await this.calendarPort.getPermissionStatus();
    if (permission !== 'granted') {
      return;
    }

    const anniversaries = await this.anniversaryRepository.findAll({ includeArchived: true });
    for (const anniversary of anniversaries) {
      if (!shouldSyncAnniversary(anniversary, true)) {
        continue;
      }

      const externalEventId = anniversary.calendarSync?.externalEventId;
      if (!externalEventId || !(await this.calendarPort.eventExists(externalEventId))) {
        await this.syncAnniversary.execute(anniversary.id);
      }
    }
  }
}

export class UpdateCalendarSyncPreferenceUseCase {
  constructor(
    private readonly preferencesRepository: PreferencesRepository,
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly calendarPort: CalendarPort,
    private readonly syncAnniversary: SyncAnniversaryToCalendarUseCase,
    private readonly unsyncAnniversary: UnsyncAnniversaryFromCalendarUseCase,
  ) {}

  async execute(enabled: boolean): Promise<void> {
    const preferences = await this.preferencesRepository.get();
    await this.preferencesRepository.save({
      ...preferences,
      calendarSyncEnabled: enabled,
      updatedAt: nowIso(),
    });

    const anniversaries = await this.anniversaryRepository.findAll({ includeArchived: true });

    if (!enabled) {
      for (const anniversary of anniversaries) {
        if (anniversary.calendarSync?.externalEventId) {
          await this.unsyncAnniversary.execute(anniversary.id);
        }
      }
      return;
    }

    let permission = await this.calendarPort.getPermissionStatus();
    if (permission === 'undetermined') {
      permission = await this.calendarPort.requestPermission();
    }
    if (permission !== 'granted') {
      return;
    }

    for (const anniversary of anniversaries) {
      if (anniversary.calendarSync?.enabled && !anniversary.archived && !anniversary.deletedAt) {
        await this.syncAnniversary.execute(anniversary.id);
      }
    }
  }
}
