import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getGoals, getGoalsByParent, updateGoal } from '../lib/goalStore';
import { CATEGORY_CONFIG } from '../lib/types';
import GoalCard from '../components/goal/GoalCard';
import { ArrowLeft } from 'lucide-react-native';

export default function GoalDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [goal, setGoal] = useState(null);
  const [children, setChildren] = useState([]);

  const loadData = useCallback(async () => {
    const all = await getGoals();
    const found = all.find(g => g.id === id);
    if (!found) {
      navigation.goBack();
      return;
    }
    setGoal(found);
    const childGoals = await getGoalsByParent(id);
    setChildren(childGoals);
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (!goal) return null;

  const cat = CATEGORY_CONFIG[goal.category];
  const progress = goal.target ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : goal.completed ? 100 : 0;

  return (
    <ScrollView
      className="flex-1 bg-background px-4 pt-6"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center mb-6">
        <ArrowLeft size={20} color="hsl(var(--muted-foreground))" />
        <Text className="text-muted-foreground ml-1">Back</Text>
      </TouchableOpacity>

      <View className="bg-card border border-border rounded-xl p-6 mb-6">
        <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{cat.icon} {cat.label}</Text>
          <Text className="text-xs text-muted-foreground capitalize">{goal.level}</Text>
        </View>
        <Text className="text-xl font-bold text-foreground mb-2">{goal.title}</Text>
        {goal.description && <Text className="text-sm text-muted-foreground mb-4">{goal.description}</Text>}

        {goal.target && goal.trackingType !== 'binary' && (
          <View className="mb-4">
            <View className="flex-row justify-between text-sm text-muted-foreground mb-2">
              <Text>{goal.current} / {goal.target} {goal.unit}</Text>
              <Text>{progress}%</Text>
            </View>
            <View className="h-2 bg-muted rounded-full overflow-hidden">
              <View className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
            </View>
          </View>
        )}

        {goal.trackingType === 'numeric' && !goal.completed && (
          <View className="flex-row items-center gap-2">
            <TextInput
              className="bg-card border border-input rounded-lg px-3 py-2 w-20 text-foreground"
              defaultValue={String(goal.current)}
              keyboardType="numeric"
              onBlur={(e) => {
                const val = Number(e.nativeEvent.text);
                if (!isNaN(val)) updateGoal(goal.id, { current: val });
                loadData();
              }}
            />
            <Text className="text-sm text-muted-foreground">{goal.unit}</Text>
          </View>
        )}
      </View>

      {children.length > 0 && (
        <View>
          <Text className="text-sm font-semibold text-foreground mb-3">Sub-goals</Text>
          {children.map(child => (
            <GoalCard key={child.id} goal={child} onUpdate={loadData} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
