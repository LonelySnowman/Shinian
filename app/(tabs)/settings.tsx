import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/src/shared/ui/Card';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <View className="gap-3 p-4">
        <Card title="数据与同步" subtitle="V1 完全离线，所有数据存储在本地">
          <Text className="mt-3 text-sm text-slate-500">云端同步将在后续版本提供。</Text>
        </Card>

        <Link href="/archive" asChild>
          <Card title="已归档纪念日" subtitle="查看已归档的纪念日" />
        </Link>

        <Card title="关于时念 Sena" subtitle="版本 1.0.0">
          <Text className="mt-3 text-sm leading-6 text-slate-500">
            时念是一款 AI-ready 的纪念日与生活事件助手。当前版本专注于离线体验与系统能力整合。
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
