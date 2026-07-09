import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { EventBus } from '@/src/core/application/bus/EventBus';
import type { AnniversaryRepository } from '@/src/core/domain/ports/AnniversaryRepository';
import type { CalendarPort } from '@/src/core/domain/ports/CalendarPort';
import type { CategoryRepository } from '@/src/core/domain/ports/CategoryRepository';
import type { NotificationPort } from '@/src/core/domain/ports/NotificationPort';
import type { PreferencesRepository } from '@/src/core/domain/ports/PreferencesRepository';
import {
  ArchiveAnniversaryUseCase,
  CreateAnniversaryUseCase,
  DeleteAnniversaryUseCase,
  GetAnniversariesUseCase,
  GetAnniversaryByIdUseCase,
  RestoreAnniversaryUseCase,
  UpdateAnniversaryUseCase,
} from '@/src/features/anniversary/application/useCases';
import {
  CalendarSyncService,
  ReconcileCalendarEventsUseCase,
  SyncAnniversaryToCalendarUseCase,
  UnsyncAnniversaryFromCalendarUseCase,
  UpdateCalendarSyncPreferenceUseCase,
} from '@/src/features/calendar-sync';
import {
  CancelRemindersForAnniversaryUseCase,
  NotificationSyncService,
  RescheduleAllRemindersUseCase,
  ScheduleRemindersForAnniversaryUseCase,
} from '@/src/features/notification';
import { createCalendarPort } from '@/src/native/calendar/createCalendarPort';
import { createNotificationPort } from '@/src/native/notifications/createNotificationPort';
import { LoadingScreen } from '@/src/shared/ui/LoadingScreen';
import { initialMigration } from '@/src/storage/migrations/001_initial';
import { runMigrations } from '@/src/storage/migrations/runner';
import { MmkvAnniversaryRepository } from '@/src/storage/repositories/MmkvAnniversaryRepository';
import { MmkvCategoryRepository } from '@/src/storage/repositories/MmkvCategoryRepository';
import { MmkvPreferencesRepository } from '@/src/storage/repositories/MmkvPreferencesRepository';

export interface AppContainer {
  eventBus: EventBus;
  anniversaryRepository: AnniversaryRepository;
  categoryRepository: CategoryRepository;
  preferencesRepository: PreferencesRepository;
  notificationPort: NotificationPort;
  calendarPort: CalendarPort;
  createAnniversary: CreateAnniversaryUseCase;
  updateAnniversary: UpdateAnniversaryUseCase;
  deleteAnniversary: DeleteAnniversaryUseCase;
  archiveAnniversary: ArchiveAnniversaryUseCase;
  restoreAnniversary: RestoreAnniversaryUseCase;
  getAnniversaries: GetAnniversariesUseCase;
  getAnniversaryById: GetAnniversaryByIdUseCase;
  scheduleReminders: ScheduleRemindersForAnniversaryUseCase;
  cancelReminders: CancelRemindersForAnniversaryUseCase;
  rescheduleAllReminders: RescheduleAllRemindersUseCase;
  notificationSyncService: NotificationSyncService;
  syncAnniversaryToCalendar: SyncAnniversaryToCalendarUseCase;
  unsyncAnniversaryFromCalendar: UnsyncAnniversaryFromCalendarUseCase;
  reconcileCalendarEvents: ReconcileCalendarEventsUseCase;
  updateCalendarSyncPreference: UpdateCalendarSyncPreferenceUseCase;
  calendarSyncService: CalendarSyncService;
}

let containerSingleton: AppContainer | null = null;

export function createAppContainer(): AppContainer {
  if (containerSingleton) {
    return containerSingleton;
  }

  const eventBus = new EventBus();
  const anniversaryRepository = new MmkvAnniversaryRepository();
  const categoryRepository = new MmkvCategoryRepository();
  const preferencesRepository = new MmkvPreferencesRepository();
  const notificationPort = createNotificationPort();
  const calendarPort = createCalendarPort();

  const scheduleReminders = new ScheduleRemindersForAnniversaryUseCase(
    anniversaryRepository,
    notificationPort,
    preferencesRepository,
  );
  const cancelReminders = new CancelRemindersForAnniversaryUseCase(
    anniversaryRepository,
    notificationPort,
  );
  const rescheduleAllReminders = new RescheduleAllRemindersUseCase(
    anniversaryRepository,
    scheduleReminders,
    notificationPort,
  );
  const notificationSyncService = new NotificationSyncService(
    eventBus,
    scheduleReminders,
    cancelReminders,
  );

  const syncAnniversaryToCalendar = new SyncAnniversaryToCalendarUseCase(
    anniversaryRepository,
    calendarPort,
    preferencesRepository,
  );
  const unsyncAnniversaryFromCalendar = new UnsyncAnniversaryFromCalendarUseCase(
    anniversaryRepository,
    calendarPort,
  );
  const reconcileCalendarEvents = new ReconcileCalendarEventsUseCase(
    anniversaryRepository,
    syncAnniversaryToCalendar,
    calendarPort,
    preferencesRepository,
  );
  const updateCalendarSyncPreference = new UpdateCalendarSyncPreferenceUseCase(
    preferencesRepository,
    anniversaryRepository,
    calendarPort,
    syncAnniversaryToCalendar,
    unsyncAnniversaryFromCalendar,
  );
  const calendarSyncService = new CalendarSyncService(
    eventBus,
    syncAnniversaryToCalendar,
    unsyncAnniversaryFromCalendar,
  );

  containerSingleton = {
    eventBus,
    anniversaryRepository,
    categoryRepository,
    preferencesRepository,
    notificationPort,
    calendarPort,
    createAnniversary: new CreateAnniversaryUseCase(anniversaryRepository, eventBus),
    updateAnniversary: new UpdateAnniversaryUseCase(anniversaryRepository, eventBus),
    deleteAnniversary: new DeleteAnniversaryUseCase(anniversaryRepository, eventBus),
    archiveAnniversary: new ArchiveAnniversaryUseCase(anniversaryRepository, eventBus),
    restoreAnniversary: new RestoreAnniversaryUseCase(anniversaryRepository, eventBus),
    getAnniversaries: new GetAnniversariesUseCase(anniversaryRepository),
    getAnniversaryById: new GetAnniversaryByIdUseCase(anniversaryRepository),
    scheduleReminders,
    cancelReminders,
    rescheduleAllReminders,
    notificationSyncService,
    syncAnniversaryToCalendar,
    unsyncAnniversaryFromCalendar,
    reconcileCalendarEvents,
    updateCalendarSyncPreference,
    calendarSyncService,
  };

  return containerSingleton;
}

const AppContainerContext = createContext<AppContainer | null>(null);

export function AppContainerProvider({
  children,
  container,
}: {
  children: ReactNode;
  container: AppContainer;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    runMigrations([initialMigration])
      .then(() => container.categoryRepository.seedDefaults(new Date().toISOString()))
      .then(() => container.rescheduleAllReminders.execute())
      .then(() => container.reconcileCalendarEvents.execute())
      .then(() => {
        container.notificationSyncService.start();
        container.calendarSyncService.start();
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
      container.notificationSyncService.stop();
      container.calendarSyncService.stop();
    };
  }, [container]);

  const value = useMemo(() => container, [container]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return <AppContainerContext.Provider value={value}>{children}</AppContainerContext.Provider>;
}

export function useAppContainer(): AppContainer {
  const container = useContext(AppContainerContext);
  if (!container) {
    throw new Error('useAppContainer must be used within AppContainerProvider');
  }
  return container;
}

export function getAppContainer(): AppContainer {
  return createAppContainer();
}
