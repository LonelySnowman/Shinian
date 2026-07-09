import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { useAnniversary } from '@/src/features/anniversary';
import {
  computeCountdown,
  formatCountdownDetail,
  formatCountdownPrimary,
  formatCountdownUnit,
} from '@/src/features/countdown';
import { useCategories } from '@/src/features/category';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';
import { Button } from '@/src/shared/ui/Button';
import { Card } from '@/src/shared/ui/Card';

export default function AnniversaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { item, loading } = useAnniversary(id);
  const { items: categories } = useCategories();
  const container = useAppContainer();

  if (loading || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const countdown = computeCountdown(item);
  const category = categories.find((entry) => entry.id === item.categoryId);
  const dateLabel = format(new Date(item.date), 'yyyy年M月d日 EEEE', { locale: zhCN });

  const handleArchive = () => {
    Alert.alert('归档纪念日', '归档后将从首页隐藏，可在设置中查看。', [
      { text: '取消', style: 'cancel' },
      {
        text: '归档',
        style: 'destructive',
        onPress: async () => {
          await container.archiveAnniversary.execute(item.id);
          router.back();
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('删除纪念日', '此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await container.deleteAnniversary.execute(item.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-4 gap-4 pb-10">
      <Card>
        <View className="items-center py-4">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.title}</Text>
          <Text className="mt-2 text-sm text-slate-500">{dateLabel}</Text>
          {item.isLunar ? <Text className="mt-1 text-xs text-slate-400">农历纪念日</Text> : null}
          {category ? <Text className="mt-1 text-xs text-slate-400">{category.name}</Text> : null}
          <View className="mt-6 flex-row items-end">
            <Text className="text-5xl font-bold" style={{ color: item.color }}>
              {formatCountdownPrimary(countdown)}
            </Text>
            <Text className="mb-2 ml-2 text-base text-slate-500">{formatCountdownUnit(countdown)}</Text>
          </View>
          <Text className="mt-2 text-sm text-slate-500">{countdown.label}</Text>
          <Text className="mt-1 text-xs text-slate-400">
            {formatCountdownDetail(countdown, 'weeks')} · {formatCountdownDetail(countdown, 'months')} ·{' '}
            {formatCountdownDetail(countdown, 'years')}
          </Text>
        </View>
      </Card>

      {item.notes ? (
        <Card title="备注">
          <Text className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.notes}</Text>
        </Card>
      ) : null}

      <Card title="提醒">
        <Text className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {item.reminders.some((reminder) => reminder.enabled)
            ? item.reminders
                .filter((reminder) => reminder.enabled)
                .map((reminder) =>
                  reminder.offsetDays === 0
                    ? `当天 ${reminder.timeOfDay} 提醒`
                    : reminder.offsetDays < 0
                      ? `提前 ${Math.abs(reminder.offsetDays)} 天 ${reminder.timeOfDay} 提醒`
                      : `${reminder.offsetDays} 天后 ${reminder.timeOfDay} 提醒`,
                )
                .join(' · ')
            : '未开启提醒'}
        </Text>
      </Card>

      <Card title="日历同步">
        <Text className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {item.calendarSync?.enabled
            ? item.calendarSync.externalEventId
              ? `已同步到系统日历${item.calendarSync.lastSyncedAt ? ` · 最近同步 ${new Date(item.calendarSync.lastSyncedAt).toLocaleString('zh-CN')}` : ''}`
              : '等待同步（请检查设置中的日历权限）'
            : '未开启日历同步'}
        </Text>
      </Card>

      <View className="gap-3">
        <Button label="编辑" onPress={() => router.push(`/anniversary/edit/${item.id}`)} />
        <Button label="归档" variant="secondary" onPress={handleArchive} />
        <Button label="删除" variant="danger" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}
