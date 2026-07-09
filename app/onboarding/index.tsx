import { router, type Href } from 'expo-router';
import { Text, View } from 'react-native';

import { OnboardingShell } from '@/src/features/onboarding';
import { Button } from '@/src/shared/ui/Button';

export default function OnboardingWelcomeScreen() {
  return (
    <OnboardingShell
      step={1}
      title="欢迎使用时念"
      description="时念帮你记录每一个值得纪念的日子。完全离线运行，数据保存在你的设备上。">
      <View className="flex-1 justify-between pb-8">
        <View className="gap-4">
          <FeatureItem title="倒计时" description="支持公历与农历，精确到天的倒计时" />
          <FeatureItem title="本地提醒" description="在重要日子到来前收到通知，无需联网" />
          <FeatureItem title="系统整合" description="同步日历、桌面小组件与 Live Activity" />
        </View>
        <Button label="开始设置" onPress={() => router.push('/onboarding/notifications' as Href)} />
      </View>
    </OnboardingShell>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <View className="rounded-2xl bg-white p-4 dark:bg-slate-900">
      <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-slate-500">{description}</Text>
    </View>
  );
}
