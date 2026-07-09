import { Link } from 'expo-router';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useCalendarPermission,
  useCalendarSyncPreference,
} from '@/src/features/calendar-sync';
import { useNotificationPermission } from '@/src/features/notification';
import { useAppContainer } from '@/src/infrastructure/di/AppContainer';
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

export default function SettingsScreen() {
  const container = useAppContainer();
  const { status, loading, request } = useNotificationPermission();
  const {
    status: calendarStatus,
    loading: calendarLoading,
    request: requestCalendar,
  } = useCalendarPermission();
  const {
    enabled: calendarSyncEnabled,
    loading: calendarPrefLoading,
    setCalendarSyncEnabled,
  } = useCalendarSyncPreference();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['bottom']}>
      <View className="gap-3 p-4">
        <Card title="通知提醒" subtitle="本地通知，无需联网">
          <Text className="mt-3 text-sm text-slate-500">
            当前权限状态：{loading ? '检查中...' : permissionLabel(status)}
          </Text>
          {status !== 'granted' ? (
            <View className="mt-4">
              <Button label="开启通知权限" onPress={() => request()} />
            </View>
          ) : (
            <Text className="mt-3 text-sm text-slate-500">
              纪念日创建或更新后，将自动调度未来 2 年的提醒。
            </Text>
          )}
        </Card>

        <Card title="日历同步" subtitle="同步到 Apple / Android 系统日历">
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
                启用日历同步
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                开启后，可在创建纪念日时选择同步到系统日历
              </Text>
            </View>
            <Switch
              value={calendarSyncEnabled}
              disabled={calendarPrefLoading}
              onValueChange={(value) => setCalendarSyncEnabled(value)}
              trackColor={{ true: '#6366F1' }}
            />
          </View>
          <Text className="mt-3 text-sm text-slate-500">
            日历权限：{calendarLoading ? '检查中...' : permissionLabel(calendarStatus)}
          </Text>
          {calendarStatus !== 'granted' ? (
            <View className="mt-4">
              <Button label="开启日历权限" onPress={() => requestCalendar()} />
            </View>
          ) : (
            <Text className="mt-3 text-sm text-slate-500">
              App 为数据源；若你在系统日历中删除了事件，下次启动会自动修复。
            </Text>
          )}
        </Card>

        <Card title="桌面小组件" subtitle="iOS 主屏幕 Widget（需 Development Build）">
          <Text className="mt-3 text-sm leading-6 text-slate-500">
            在 iOS 设备上添加「时念」小组件，可查看 Small / Medium / Large 三种尺寸的倒计时。纪念日变更后会自动刷新。
          </Text>
          <View className="mt-4">
            <Button label="刷新小组件数据" onPress={() => container.refreshWidgets.execute()} />
          </View>
        </Card>

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
