export interface ReminderRule {
  offsetDays: number;
  timeOfDay: string;
  enabled: boolean;
}

export const DEFAULT_REMINDERS: ReminderRule[] = [
  { offsetDays: 0, timeOfDay: '09:00', enabled: true },
];

export function normalizeReminders(reminders?: ReminderRule[] | null): ReminderRule[] {
  if (!reminders?.length) {
    return DEFAULT_REMINDERS;
  }
  return reminders.map((reminder) => ({
    offsetDays: reminder.offsetDays ?? 0,
    timeOfDay: reminder.timeOfDay ?? '09:00',
    enabled: reminder.enabled ?? true,
  }));
}
