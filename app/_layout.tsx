import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {
  AppContainerProvider,
  createAppContainer,
} from '@/src/infrastructure/di/AppContainer';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const container = createAppContainer();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContainerProvider container={container}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="anniversary/create"
          options={{ presentation: 'modal', title: '新建纪念日' }}
        />
        <Stack.Screen
          name="anniversary/edit/[id]"
          options={{ presentation: 'modal', title: '编辑纪念日' }}
        />
        <Stack.Screen name="anniversary/[id]" options={{ title: '纪念日详情' }} />
        <Stack.Screen name="archive/index" options={{ title: '已归档' }} />
      </Stack>
    </AppContainerProvider>
  );
}
