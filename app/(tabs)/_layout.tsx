import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        headerStyle: { backgroundColor: '#F8FAFC' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '时念',
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          headerRight: () => (
            <Link href="/anniversary/create" asChild>
              <Pressable className="mr-4 rounded-full bg-sena-primary px-3 py-1.5">
                <Text className="text-sm font-semibold text-white">新建</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarLabel: '日历',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: '分类',
          tabBarLabel: '分类',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarLabel: '设置',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
