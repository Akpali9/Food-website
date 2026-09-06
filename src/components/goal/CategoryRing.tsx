import React from 'react';
import { View, Text } from 'react-native';
import { CATEGORY_CONFIG, GoalCategory } from '../../lib/types';

export default function CategoryRing({ category, progress }: { category: GoalCategory; progress: number }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <View className="items-center">
      <View className="w-16 h-16 rounded-full border-4 border-muted items-center justify-center">
        <Text className="text-lg">{config.icon}</Text>
      </View>
      <Text className="text-xs text-muted-foreground mt-1">{config.label}</Text>
      <Text className="text-xs font-medium text-foreground">{progress}%</Text>
    </View>
  );
}
