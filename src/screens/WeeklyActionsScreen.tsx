import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGoalsByLevel, updateGoal, addGoal } from '../lib/goalStore';
import { CATEGORY_CONFIG, GoalCategory, TrackingType } from '../lib/types';
import { Check, Flame, TrendingUp, Plus, X, Minus } from 'lucide-react-native';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function weeklyHabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('mental');
  const [newTracking, setNewTracking] = useState<TrackingType>('binary');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const loadData = useCallback(async () => {
    const weekly = await getGoalsByLevel('weekly');
    setHabits(weekly);
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

  const handleTap = async (id: string, completed: boolean) => {
    await updateGoal(id, { completed: !completed, current: completed ? 0 : 1 });
    await loadData();
  };

  const handleIncrement = async (id: string, current: number, target?: number) => {
    const next = current + 1;
    await updateGoal(id, { current: next, completed: target ? next >= target : false });
    await loadData();
  };

  const handleDecrement = async (id: string, current: number) => {
    const next = Math.max(0, current - 1);
    await updateGoal(id, { current: next, completed: false });
    await loadData();
  };

  const handleQuickAdd = async () => {
    if (!newTitle.trim()) return;
    await addGoal({
      title: newTitle.trim(),
      category: newCategory,
      trackingType: newTracking,
      level: 'weekly',
      target: newTracking !== 'binary' ? (Number(newTarget) || undefined) : undefined,
      current: 0,
      unit: newTracking !== 'binary' ? (newUnit || undefined) : undefined,
      completed: false,
    });
    setNewTitle('');
    setNewTarget('');
    setNewUnit('');
    setShowQuickAdd(false);
    await loadData();
  };

  const completed = habits.filter(g => g.completed).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const dayOfWeek = new Date().getDay();
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return (
    <ScrollView
      className="flex-1 bg-background px-4 pt-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header with progress */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-xl font-bold text-foreground">Today's Habits</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View className="relative w-16 h-16">
          {/* Circular progress */}
          <View className="w-full h-full rounded-full border-4 border-muted justify-center items-center">
            <Text className="text-sm font-bold text-foreground">{pct}%</Text>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-card border border-border rounded-xl p-3 flex-1 mr-2 items-center">
          <Check size={16} color="hsl(var(--success))" />
          <Text className="text-lg font-bold text-foreground">{completed}</Text>
          <Text className="text-[10px] text-muted-foreground">Done</Text>
        </View>
        <View className="bg-card border border-border rounded-xl p-3 flex-1 mx-1 items-center">
          <TrendingUp size={16} color="hsl(var(--accent))" />
          <Text className="text-lg font-bold text-foreground">{total - completed}</Text>
          <Text className="text-[10px] text-muted-foreground">Remaining</Text>
        </View>
        <View className="bg-card border border-border rounded-xl p-3 flex-1 ml-2 items-center">
          <Flame size={16} color="hsl(var(--destructive))" />
          <Text className="text-lg font-bold text-foreground">{total}</Text>
          <Text className="text-[10px] text-muted-foreground">Total</Text>
        </View>
      </View>

      {/* Week dots */}
      <View className="flex-row justify-between mb-6 px-2">
        {DAYS.map((day, i) => (
          <View key={day} className="items-center gap-1">
            <Text className={`text-[10px] font-medium ${i === todayIdx ? 'text-accent' : 'text-muted-foreground'}`}>{day}</Text>
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                i === todayIdx ? 'bg-accent' : i < todayIdx ? 'bg-success/20' : 'bg-muted'
              }`}
            >
              <Text className={`text-[10px] font-bold ${i === todayIdx ? 'text-accent-foreground' : i < todayIdx ? 'text-success' : 'text-muted-foreground'}`}>
                {i < todayIdx ? '✓' : i === todayIdx ? new Date().getDate() : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Add */}
      {showQuickAdd ? (
        <View className="bg-card border border-accent/30 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-semibold text-foreground">Quick Add Habit</Text>
            <TouchableOpacity onPress={() => setShowQuickAdd(false)}>
              <X size={16} color="hsl(var(--muted-foreground))" />
            </TouchableOpacity>
          </View>
          <TextInput
            className="bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-foreground mb-3"
            placeholder="e.g. Meditate 10 min"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus
          />
          {/* Category chips */}
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {(['mental', 'emotional', 'financial', 'physical', 'professional'] as GoalCategory[]).map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCategory(cat)}
                className={`px-2.5 py-1 rounded-full ${newCategory === cat ? 'bg-accent' : 'bg-secondary'}`}
              >
                <Text className={`text-[11px] font-medium ${newCategory === cat ? 'text-accent-foreground' : 'text-secondary-foreground'}`}>
                  {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Tracking type */}
          <View className="flex-row gap-2 mb-3">
            {(['binary', 'numeric', 'time'] as TrackingType[]).map(tt => (
              <TouchableOpacity
                key={tt}
                onPress={() => setNewTracking(tt)}
                className={`flex-1 py-1.5 rounded-lg ${newTracking === tt ? 'bg-accent/20 border border-accent/30' : 'bg-muted'}`}
              >
                <Text className={`text-[11px] font-medium text-center ${newTracking === tt ? 'text-accent' : 'text-muted-foreground'}`}>
                  {tt === 'binary' ? '✓ Yes/No' : tt === 'numeric' ? '# Count' : '⏱ Time'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {newTracking !== 'binary' && (
            <View className="flex-row gap-2 mb-3">
              <TextInput
                className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground"
                placeholder="Target"
                placeholderTextColor="hsl(var(--muted-foreground))"
                value={newTarget}
                onChangeText={setNewTarget}
                keyboardType="numeric"
              />
              <TextInput
                className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground"
                placeholder="Unit (pages, mins...)"
                placeholderTextColor="hsl(var(--muted-foreground))"
                value={newUnit}
                onChangeText={setNewUnit}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={handleQuickAdd}
            disabled={!newTitle.trim()}
            className="bg-accent py-2.5 rounded-xl active:opacity-70 disabled:opacity-40"
          >
            <Text className="text-accent-foreground text-sm font-semibold text-center">Add Habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowQuickAdd(true)}
          className="bg-accent py-3 rounded-2xl mb-4"
        >
          <Text className="text-accent-foreground text-sm font-semibold text-center">+ Quick Add Habit</Text>
        </TouchableOpacity>
      )}

      {/* Habit list */}
      {habits.length === 0 && !showQuickAdd ? (
        <View className="bg-card border border-border rounded-2xl p-8 items-center">
          <Text className="text-muted-foreground">No weekly habits yet. Start small!</Text>
        </View>
      ) : (
        habits.map(habit => {
          const cat = CATEGORY_CONFIG[habit.category];
          const progress = habit.target ? Math.min(100, Math.round((habit.current / habit.target) * 100)) : habit.completed ? 100 : 0;
          return (
            <View
              key={habit.id}
              className={`bg-card border rounded-2xl p-4 mb-2 ${habit.completed ? 'border-success/30 bg-success/5' : 'border-border'}`}
            >
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => handleTap(habit.id, habit.completed)}
                  className={`w-11 h-11 rounded-full items-center justify-center ${habit.completed ? 'bg-success' : 'border-2 border-border'}`}
                >
                  {habit.completed && <Check size={20} color="white" />}
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className={`text-sm font-medium ${habit.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {cat.icon} {habit.title}
                  </Text>
                  {habit.target && habit.trackingType !== 'binary' && (
                    <View className="flex-row items-center gap-2 mt-1.5">
                      <View className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <View className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                      </View>
                      <Text className="text-[10px] text-muted-foreground">{habit.current}/{habit.target}</Text>
                    </View>
                  )}
                </View>
                {habit.trackingType === 'numeric' && !habit.completed && habit.target && (
                  <View className="flex-row items-center gap-1">
                    <TouchableOpacity onPress={() => handleDecrement(habit.id, habit.current)} className="w-8 h-8 bg-muted rounded-full items-center justify-center">
                      <Minus size={14} color="hsl(var(--muted-foreground))" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleIncrement(habit.id, habit.current, habit.target)} className="w-8 h-8 bg-accent rounded-full items-center justify-center">
                      <Plus size={14} color="hsl(var(--accent-foreground))" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
