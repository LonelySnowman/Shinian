import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-xl font-semibold text-slate-900 dark:text-slate-100">日历视图</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          将在后续版本提供月历热力视图，展示所有纪念日在全年中的分布。
        </Text>
      </View>
    </SafeAreaView>
  );
}
