import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { OnboardingShell, useOnboardingStatus } from '@/src/features/onboarding';
import { Button } from '@/src/shared/ui/Button';

export default function OnboardingDoneScreen() {
  const { complete } = useOnboardingStatus();

  const finish = async (destination: '/(tabs)' | '/anniversary/create') => {
    await complete();
    router.replace(destination);
  };

  return (
    <OnboardingShell
      step={4}
      title="准备就绪"
      description="时念已配置完成。现在可以创建你的第一个纪念日，或直接进入首页。">
      <View className="flex-1 justify-between pb-8">
        <View className="items-center justify-center rounded-3xl bg-violet-50 py-16 dark:bg-violet-950">
          <Text className="text-6xl">🎉</Text>
          <Text className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            开始记录重要时刻
          </Text>
          <Text className="mt-2 px-8 text-center text-sm leading-6 text-slate-500">
            生日、恋爱纪念日、入职日……每一个值得记住的日子，时念都会帮你倒数。
          </Text>
        </View>

        <View className="gap-3">
          <Button label="创建第一个纪念日" onPress={() => finish('/anniversary/create')} />
          <Button label="进入首页" variant="secondary" onPress={() => finish('/(tabs)')} />
        </View>
      </View>
    </OnboardingShell>
  );
}
