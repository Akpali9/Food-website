import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Home, Plus, ArrowRight } from 'lucide-react-native';

import { getGoals, getGoalsByLevel, getCompletionRate, getStreak } from '../lib/goalStore';
import { GoalCategory, CATEGORY_CONFIG } from '../lib/types';
import StatCard from '../components/goal/StatCard';
import CategoryRing from '../components/goal/CategoryRing';
import GoalCard from '../components/goal/GoalCard';

export default function DashboardScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    allGoals: [],
    weeklyGoals: [],
    quarterlyGoals: [],
    completionRate: 0,
    streak: 0,
  });

  const loadData = useCallback(async () => {
    const [allGoals, weeklyGoals, quarterlyGoals, completionRate, streak] = await Promise.all([
      getGoals(),
      getGoalsByLevel('weekly'),
      getGoalsByLevel('quarterly'),
      getCompletionRate('weekly'),
      getStreak(),
    ]);
    setData({ allGoals, weeklyGoals, quarterlyGoals, completionRate, streak });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';
  if (currentHour < 12) greeting = 'Good Morning';
  else if (currentHour < 18) greeting = 'Good Afternoon';

  const categories: GoalCategory[] = ['mental', 'emotional', 'financial', 'physical', 'professional'];

  return (
    <ScrollView
      className="flex-1 bg-background px-4 pt-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground">{greeting} 👋</Text>
        <Text className="text-muted-foreground mt-1">What's your main growth area this week?</Text>
      </View>

      {/* Stats */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <StatCard
          label="Weekly Progress"
          value={`${data.completionRate}%`}
          sublabel={`${data.weeklyGoals.filter(g => g.completed).length} of ${data.weeklyGoals.length} done`}
          accent
        />
        <StatCard label="Total Goals" value={data.allGoals.length} sublabel="Across all levels" />
        <StatCard label="Streak" value={`${data.streak} wk`} sublabel="Keep it up!" />
        <StatCard
          label="This Quarter"
          value={data.quarterlyGoals.length}
          sublabel={`${getCompletionRate('quarterly')}% complete`}
        />
      </View>

      {/* Category Rings */}
      <View className="bg-card border border-border rounded-xl p-4 mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">Growth Areas</Text>
        <View className="flex-row justify-around flex-wrap">
          {categories.map(cat => (
            <CategoryRing key={cat} category={cat} progress={getCompletionRate(undefined, cat)} />
          ))}
        </View>
      </View>

      {/* Weekly Priorities */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-semibold text-foreground">Weekly Priorities</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <Text className="text-xs text-accent flex-row items-center">View all <ArrowRight size={12} color="hsl(var(--accent))" /></Text>
          </TouchableOpacity>
        </View>

        {data.weeklyGoals.length === 0 ? (
          <View className="bg-card border border-border rounded-xl p-8 items-center">
            <Text className="text-muted-foreground text-sm mb-3">No weekly goals yet</Text>
            <TouchableOpacity className="bg-accent px-4 py-2 rounded-lg" onPress={() => navigation.navigate('NewGoal')}>
              <Text className="text-accent-foreground font-medium">Add your first goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          data.weeklyGoals.slice(0, 3).map(goal => (
            <GoalCard key={goal.id} goal={goal} onUpdate={loadData} />
          ))
        )}
      </View>

      {/* Explore Categories */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">Explore by Category</Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const count = data.allGoals.filter(g => g.category === cat).length;
            return (
              <TouchableOpacity
                key={cat}
                className="bg-card border border-border rounded-xl p-4 w-[30%] items-center mb-3"
                onPress={() => navigation.navigate('Goals', { category: cat })}
              >
                <Text className="text-2xl">{config.icon}</Text>
                <Text className="text-sm font-medium text-foreground mt-1">{config.label}</Text>
                <Text className="text-xs text-muted-foreground">{count} goals</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
