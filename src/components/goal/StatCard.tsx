import React from 'react';
import { View, Text } from 'react-native';

export default function StatCard({ label, value, sublabel, accent }: any) {
  return (
    <View className={`bg-card border border-border rounded-xl p-3 w-[48%] mb-2 ${accent ? 'border-accent/30' : ''}`}>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className="text-xl font-bold text-foreground">{value}</Text>
      <Text className="text-[10px] text-muted-foreground">{sublabel}</Text>
    </View>
  );
}
