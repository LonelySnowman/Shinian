import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-8 py-16">
      <Text className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-6 text-slate-500">{description}</Text>
    </View>
  );
}
