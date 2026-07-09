import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/src/features/onboarding/presentation/components/OnboardingProgress';

interface OnboardingShellProps {
  step: number;
  total?: number;
  title: string;
  description: string;
  children: ReactNode;
}

export function OnboardingShell({
  step,
  total = 4,
  title,
  description,
  children,
}: OnboardingShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <OnboardingProgress step={step} total={total} />
      <View className="flex-1 px-6 pt-10">
        <Text className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</Text>
        <Text className="mt-4 text-base leading-7 text-slate-500">{description}</Text>
        <View className="mt-8 flex-1">{children}</View>
      </View>
    </SafeAreaView>
  );
}
