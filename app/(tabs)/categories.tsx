import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCategories } from '@/src/features/category';

export default function CategoriesScreen() {
  const { items } = useCategories();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3"
        renderItem={({ item }) => (
          <View
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 flex-row items-center"
            style={{ borderLeftWidth: 4, borderLeftColor: item.color }}>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.name}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {item.isDefault ? '系统默认分类' : '自定义分类'}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
