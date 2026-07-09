import type { ReminderRule } from '@/src/core/domain/value-objects/ReminderRule';

import type { AnniversaryFormValues } from './anniversaryFormSchema';

export function remindersFromFormValues(values: AnniversaryFormValues): ReminderRule[] {
  return [
    {
      offsetDays: values.reminderOffsetDays,
      timeOfDay: '09:00',
      enabled: values.reminderEnabled,
    },
  ];
}

export function formValuesFromReminders(reminders: ReminderRule[]): Pick<
  AnniversaryFormValues,
  'reminderEnabled' | 'reminderOffsetDays'
> {
  const primary = reminders.find((item) => item.enabled) ?? reminders[0];
  return {
    reminderEnabled: primary?.enabled ?? true,
    reminderOffsetDays: primary?.offsetDays ?? 0,
  };
}
