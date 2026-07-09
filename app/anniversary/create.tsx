import { router } from 'expo-router';

import { AnniversaryForm } from '@/src/features/anniversary/presentation/components/AnniversaryForm';
import type { AnniversaryFormValues } from '@/src/features/anniversary';
import { remindersFromFormValues } from '@/src/features/anniversary/presentation/schemas/reminderFormMapper';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export default function CreateAnniversaryScreen() {
  const container = useAppContainer();

  const handleSubmit = async (values: AnniversaryFormValues) => {
    await container.createAnniversary.execute({
      title: values.title,
      date: values.date,
      isLunar: values.isLunar,
      repeatRule: { type: values.repeatType },
      reminders: remindersFromFormValues(values),
      calendarSyncEnabled: values.calendarSyncEnabled,
      categoryId: values.categoryId,
      icon: values.icon,
      color: values.color,
      notes: values.notes,
    });
    router.back();
  };

  return <AnniversaryForm submitLabel="创建纪念日" onSubmit={handleSubmit} />;
}
