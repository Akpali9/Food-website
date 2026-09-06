import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getGoals } from '../lib/goalStore';
import { GoalCategory, GoalLevel, CATEGORY_CONFIG } from '../lib/types';
import GoalCard from '../components/goal/GoalCard';

const LEVELS: GoalLevel[] = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'];

export default function GoalsScreen({ navigation }: any) {
  const route = useRoute();
  const initialCategory = route.params?.category as GoalCategory | undefined;
  const [activeCategory, setActiveCategory] = useState<GoalCategory | undefined>(initialCategory);
  const [activeLevel, setActiveLevel] = useState<GoalLevel | undefined>();
  const [goals, setGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const all = await getGoals();
    let filtered = all;
    if (activeCategory) filtered = filtered.filter(g => g.category === activeCategory);
    if (activeLevel) filtered = filtered.filter(g => g.level === activeLevel);
    setGoals(filtered);
  }, [activeCategory, activeLevel]);

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

  return (
    <ScrollView
      className="flex-1 bg-background px-4 pt-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-2xl font-bold text-foreground mb-6">Goals</Text>

      {/* Category filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveCategory(undefined)}
            className={`px-3 py-1.5 rounded-lg ${!activeCategory ? 'bg-primary' : 'bg-secondary'}`}
          >
            <Text className={`text-xs font-medium ${!activeCategory ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>All</Text>
          </TouchableOpacity>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveCategory(key as GoalCategory)}
              className={`px-3 py-1.5 rounded-lg ${activeCategory === key ? 'bg-primary' : 'bg-secondary'}`}
            >
              <Text className={`text-xs font-medium ${activeCategory === key ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                {config.icon} {config.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Level filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveLevel(undefined)}
            className={`px-3 py-1.5 rounded-lg ${!activeLevel ? 'bg-accent' : 'bg-muted'}`}
          >
            <Text className={`text-xs font-medium ${!activeLevel ? 'text-accent-foreground' : 'text-muted-foreground'}`}>All Levels</Text>
          </TouchableOpacity>
          {LEVELS.map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => setActiveLevel(level)}
              className={`px-3 py-1.5 rounded-lg ${activeLevel === level ? 'bg-accent' : 'bg-muted'}`}
            >
              <Text className={`text-xs font-medium capitalize ${activeLevel === level ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Goal list */}
      {goals.length === 0 ? (
        <View className="bg-card border border-border rounded-xl p-12 items-center">
          <Text className="text-muted-foreground">No goals found. Start by creating one!</Text>
        </View>
      ) : (
        goals.map(goal => <GoalCard key={goal.id} goal={goal} onUpdate={loadData} />)
      )}
    </ScrollView>
  );
}
