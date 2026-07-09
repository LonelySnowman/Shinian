import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnniversaryCard } from '@/src/features/anniversary/presentation/components/AnniversaryCard';
import { useAnniversaries } from '@/src/features/anniversary';
import { useCategories } from '@/src/features/category';
import { EmptyState } from '@/src/shared/ui/EmptyState';

export default function ArchiveScreen() {
  const { items, loading } = useAnniversaries(true);
  const archivedItems = items.filter((item) => item.archived);
  const { items: categories } = useCategories();
  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      {loading ? null : archivedItems.length === 0 ? (
        <EmptyState title="暂无归档" description="归档的纪念日会显示在这里。" />
      ) : (
        <FlatList
          data={archivedItems}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 pb-8"
          ListHeaderComponent={
            <Text className="mb-3 text-sm text-slate-500">共 {archivedItems.length} 个已归档纪念日</Text>
          }
          renderItem={({ item }) => (
            <AnniversaryCard anniversary={item} category={categoryMap[item.categoryId]} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
