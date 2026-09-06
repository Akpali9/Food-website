import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { Home, Target, Calendar, Clock, MoreHorizontal } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import GoalsScreen from '../screens/GoalsScreen';
import DailyHabitsScreen from '../screens/DailyHabitsScreen';
import WeeklyActionsScreen from '../screens/WeeklyActionsScreen';
import GoalDetailScreen from '../screens/GoalDetailScreen';
import NewGoalScreen from '../screens/NewGoalScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InstallScreen from '../screens/InstallScreen';

import { TabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'hsl(var(--accent))',
        tabBarInactiveTintColor: 'hsl(var(--muted-foreground))',
        tabBarStyle: {
          paddingBottom: insets.bottom || 8,
          backgroundColor: 'hsl(var(--background))',
          borderTopColor: 'hsl(var(--border))',
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ tabBarIcon: ({ color }) => <Target size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Daily"
        component={DailyHabitsScreen}
        options={{ tabBarIcon: ({ color }) => <Calendar size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Weekly"
        component={WeeklyActionsScreen}
        options={{ tabBarIcon: ({ color }) => <Clock size={22} color={color} /> }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{ tabBarIcon: ({ color }) => <MoreHorizontal size={22} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Templates" component={TemplatesScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Install" component={InstallScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        <Stack.Screen name="NewGoal" component={NewGoalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
