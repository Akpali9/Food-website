import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateGoal } from '../../lib/goalStore';
import { CATEGORY_CONFIG } from '../../lib/types';
import { Check, ChevronRight } from 'lucide-react-native';

export default function GoalCard({ goal, onUpdate }: any) {
  const navigation = useNavigation();
  const cat = CATEGORY_CONFIG[goal.category];
  const progress = goal.target ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : goal.completed ? 100 : 0;

  const toggleComplete = async () => {
    await updateGoal(goal.id, { completed: !goal.completed, current: goal.completed ? 0 : 1 });
    onUpdate?.();
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('GoalDetail', { id: goal.id })}
      className={`bg-card border rounded-xl p-4 mb-2 ${goal.completed ? 'border-success/30 bg-success/5' : 'border-border'}`}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={toggleComplete} className="w-8 h-8 rounded-full border-2 border-border items-center justify-center mr-3">
          {goal.completed && <Check size={16} color="hsl(var(--success))" />}
        </TouchableOpacity>
        <View className="flex-1">
          <Text className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {cat.icon} {goal.title}
          </Text>
          {goal.target && (
            <View className="flex-row items-center mt-1">
              <View className="flex-1 h-1.5 bg-muted rounded-full">
                <View className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
              </View>
              <Text className="text-[10px] text-muted-foreground ml-2">{goal.current}/{goal.target}</Text>
            </View>
          )}
        </View>
        <ChevronRight size={16} color="hsl(var(--muted-foreground))" />
      </View>
    </TouchableOpacity>
  );
}
