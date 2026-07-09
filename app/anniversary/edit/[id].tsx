import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AnniversaryForm } from '@/src/features/anniversary/presentation/components/AnniversaryForm';
import type { AnniversaryFormValues } from '@/src/features/anniversary';
import { useAnniversary } from '@/src/features/anniversary';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';

export default function EditAnniversaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { item, loading } = useAnniversary(id);
  const container = useAppContainer();

  if (loading || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const handleSubmit = async (values: AnniversaryFormValues) => {
    await container.updateAnniversary.execute(id, {
      title: values.title,
      date: values.date,
      isLunar: values.isLunar,
      repeatRule: { type: values.repeatType },
      categoryId: values.categoryId,
      icon: values.icon,
      color: values.color,
      notes: values.notes,
    });
    router.back();
  };

  return (
    <AnniversaryForm
      submitLabel="保存修改"
      defaultValues={{
        title: item.title,
        date: new Date(item.date),
        isLunar: item.isLunar,
        repeatType: item.repeatRule.type,
        categoryId: item.categoryId,
        icon: item.icon,
        color: item.color,
        notes: item.notes ?? '',
      }}
      onSubmit={handleSubmit}
    />
  );
}
