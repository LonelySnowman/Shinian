import { router, type Href } from 'expo-router';
import { Switch, Text, View } from 'react-native';

import { useCalendarPermission, useCalendarSyncPreference } from '@/src/features/calendar-sync';
import { OnboardingShell } from '@/src/features/onboarding';
import { Button } from '@/src/shared/ui/Button';
import { Card } from '@/src/shared/ui/Card';

function permissionLabel(status: string): string {
  switch (status) {
    case 'granted':
      return '已授权';
    case 'denied':
      return '未授权';
    default:
      return '待授权';
  }
}

export default function OnboardingCalendarScreen() {
  const { status, loading: permissionLoading, request } = useCalendarPermission();
  const { enabled, loading: prefLoading, setCalendarSyncEnabled } = useCalendarSyncPreference();

  const handleToggle = async (value: boolean) => {
    await setCalendarSyncEnabled(value);
    if (value && status !== 'granted') {
      await request();
    }
  };

  return (
    <OnboardingShell
      step={3}
      title="同步到系统日历"
      description="可选功能。开启后，创建纪念日时可选择同步到 Apple / Android 系统日历。">
      <View className="flex-1 justify-between pb-8">
        <Card title="日历同步">
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
                启用日历同步
              </Text>
              <Text className="mt-1 text-xs text-slate-400">可在设置中随时关闭</Text>
            </View>
            <Switch
              value={enabled}
              disabled={prefLoading}
              onValueChange={handleToggle}
              trackColor={{ true: '#6366F1' }}
            />
          </View>
          <Text className="mt-3 text-sm text-slate-500">
            日历权限：{permissionLoading ? '检查中...' : permissionLabel(status)}
          </Text>
          {enabled && status !== 'granted' ? (
            <View className="mt-4">
              <Button label="开启日历权限" onPress={() => request()} />
            </View>
          ) : null}
        </Card>

        <View className="gap-3">
          <Button label="继续" onPress={() => router.push('/onboarding/done' as Href)} />
          <Button label="跳过" variant="ghost" onPress={() => router.push('/onboarding/done' as Href)} />
        </View>
      </View>
    </OnboardingShell>
  );
}
