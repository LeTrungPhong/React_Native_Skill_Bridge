import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity'
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat'
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams'
        }}
      />
      <Tabs.Screen
        name="assignment"
        options={{
          title: 'Assignment'
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
        }}
      />
    </Tabs>
  );
}
