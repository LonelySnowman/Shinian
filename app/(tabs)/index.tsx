import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnniversaryCard } from '@/src/features/anniversary/presentation/components/AnniversaryCard';
import { useAnniversaries } from '@/src/features/anniversary';
import { useCategories } from '@/src/features/category';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { Button } from '@/src/shared/ui/Button';

export default function HomeScreen() {
  const { items, loading } = useAnniversaries(false);
  const { items: categories } = useCategories();

  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">即将到来</Text>
        <Text className="mt-1 text-sm text-slate-500">记录每一个值得纪念的日子</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          title="还没有纪念日"
          description="创建你的第一个纪念日，开始记录生活中重要的时刻。"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <AnniversaryCard anniversary={item} category={categoryMap[item.categoryId]} />
          )}
        />
      )}

      {!loading && items.length === 0 ? (
        <View className="px-4 pb-8">
          <Link href="/anniversary/create" asChild>
            <Button label="创建第一个纪念日" />
          </Link>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
