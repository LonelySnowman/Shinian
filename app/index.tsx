import { Redirect, type Href } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useOnboardingStatus } from '@/src/features/onboarding';

export default function Index() {
  const { hasOnboarded, loading } = useOnboardingStatus();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!hasOnboarded) {
    return <Redirect href={'/onboarding' as Href} />;
  }

  return <Redirect href="/(tabs)" />;
}
