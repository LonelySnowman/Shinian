import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';

import type { Anniversary } from '@/src/core/domain/entities/Anniversary';
import type { Category } from '@/src/core/domain/entities/Category';
import {
  computeCountdown,
  formatCountdownPrimary,
  formatCountdownSubtitle,
  formatCountdownUnit,
} from '@/src/features/countdown';

interface AnniversaryCardProps {
  anniversary: Anniversary;
  category?: Category;
}

export function AnniversaryCard({ anniversary, category }: AnniversaryCardProps) {
  const countdown = computeCountdown(anniversary);
  const dateLabel = format(new Date(anniversary.date), 'yyyy年M月d日', { locale: zhCN });

  return (
    <Link href={`/anniversary/${anniversary.id}`} asChild>
      <Pressable className="mb-3">
        <View
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
          style={{ borderLeftWidth: 4, borderLeftColor: anniversary.color }}>
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {anniversary.title}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {dateLabel}
                {anniversary.isLunar ? ' · 农历' : ''}
              </Text>
              {category ? (
                <Text className="mt-1 text-xs text-slate-400">{category.name}</Text>
              ) : null}
            </View>
            <View className="items-end">
              <View className="flex-row items-end">
                <Text className="text-3xl font-bold text-sena-primary">
                  {formatCountdownPrimary(countdown)}
                </Text>
                <Text className="mb-1 ml-1 text-sm text-slate-500">
                  {formatCountdownUnit(countdown)}
                </Text>
              </View>
              <Text className="mt-1 text-xs text-slate-400">
                {formatCountdownSubtitle(countdown)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
