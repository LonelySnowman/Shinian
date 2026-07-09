import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import type { NotificationPort } from '@/src/core/domain/ports/NotificationPort';
import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';
import { planReminderNotifications } from '@/src/features/notification/domain/reminderPlanner';

export class ScheduleRemindersForAnniversaryUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly notificationPort: NotificationPort,
    private readonly preferencesRepository: PreferencesRepository,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    const anniversary = await this.anniversaryRepository.findById(anniversaryId);
    if (!anniversary) {
      return;
    }

    await this.notificationPort.cancelMany(anniversary.notificationIds ?? []);

    if (anniversary.archived || anniversary.deletedAt) {
      await this.anniversaryRepository.save({
        ...anniversary,
        notificationIds: [],
      });
      return;
    }

    const preferences = await this.preferencesRepository.get();
    if (!preferences.defaultRemindersEnabled) {
      return;
    }

    let permission = await this.notificationPort.getPermissionStatus();
    if (permission === 'undetermined') {
      permission = await this.notificationPort.requestPermission();
    }
    if (permission !== 'granted') {
      return;
    }

    const intents = planReminderNotifications(anniversary);
    for (const intent of intents) {
      await this.notificationPort.schedule(intent);
    }

    await this.anniversaryRepository.save({
      ...anniversary,
      notificationIds: intents.map((intent) => intent.id),
    });
  }
}

export class CancelRemindersForAnniversaryUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly notificationPort: NotificationPort,
  ) {}

  async execute(anniversaryId: string): Promise<void> {
    const anniversary = await this.anniversaryRepository.findRecordById(anniversaryId);
    if (!anniversary) {
      return;
    }

    await this.notificationPort.cancelMany(anniversary.notificationIds ?? []);

    if (anniversary.deletedAt) {
      return;
    }

    await this.anniversaryRepository.save({
      ...anniversary,
      notificationIds: [],
    });
  }
}

export class RescheduleAllRemindersUseCase {
  constructor(
    private readonly anniversaryRepository: AnniversaryRepository,
    private readonly scheduleReminders: ScheduleRemindersForAnniversaryUseCase,
    private readonly notificationPort: NotificationPort,
  ) {}

  async execute(): Promise<void> {
    const anniversaries = await this.anniversaryRepository.findAll({ includeArchived: true });
    const activeAnniversaries = anniversaries.filter(
      (item) => !item.deletedAt && !item.archived,
    );

    for (const anniversary of activeAnniversaries) {
      await this.scheduleReminders.execute(anniversary.id);
    }

    // Re-fetch after scheduling so notificationIds reflect the latest state.
    const refreshed = await this.anniversaryRepository.findAll({ includeArchived: true });
    const expectedIds = new Set(
      refreshed
        .filter((item) => !item.deletedAt && !item.archived)
        .flatMap((item) => item.notificationIds ?? []),
    );
    const pendingIds = await this.notificationPort.getPendingIds();
    const staleIds = pendingIds.filter((id) => !expectedIds.has(id));

    if (staleIds.length > 0) {
      await this.notificationPort.cancelMany(staleIds);
    }
  }
}
