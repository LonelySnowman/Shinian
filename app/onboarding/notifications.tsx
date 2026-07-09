import { router, type Href } from 'expo-router';
import { Text, View } from 'react-native';

import { OnboardingShell } from '@/src/features/onboarding';
import { useNotificationPermission } from '@/src/features/notification';
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

export default function OnboardingNotificationsScreen() {
  const { status, loading, request } = useNotificationPermission();

  return (
    <OnboardingShell
      step={2}
      title="开启通知提醒"
      description="在纪念日到来前收到本地提醒。你可以随时在系统设置中更改权限。">
      <View className="flex-1 justify-between pb-8">
        <Card title="本地通知">
          <Text className="mt-3 text-sm leading-6 text-slate-500">
            时念会在纪念日当天或提前几天发送提醒，所有通知均在本地调度，无需联网。
          </Text>
          <Text className="mt-3 text-sm text-slate-500">
            当前权限状态：{loading ? '检查中...' : permissionLabel(status)}
          </Text>
        </Card>

        <View className="gap-3">
          {status !== 'granted' ? (
            <Button label="开启通知权限" onPress={() => request()} />
          ) : (
            <Button label="继续" onPress={() => router.push('/onboarding/calendar' as Href)} />
          )}
          <Button
            label={status === 'granted' ? '跳过' : '稍后再说'}
            variant="ghost"
            onPress={() => router.push('/onboarding/calendar' as Href)}
          />
        </View>
      </View>
    </OnboardingShell>
  );
}
