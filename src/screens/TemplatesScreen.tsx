import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TEMPLATES, CATEGORY_CONFIG } from '../lib/types';
import { addGoal } from '../lib/goalStore';

export default function TemplatesScreen() {
  const navigation = useNavigation();

  const useTemplate = async (templateId: string) => {
    const t = TEMPLATES.find(tpl => tpl.id === templateId);
    if (!t) return;
    await addGoal({
      title: t.title,
      description: t.description,
      category: t.category,
      level: 'yearly',
      trackingType: t.trackingType,
      target: t.yearlyTarget,
      current: 0,
      unit: t.unit,
      completed: false,
    });
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-6">
      <Text className="text-2xl font-bold text-foreground mb-2">Goal Templates</Text>
      <Text className="text-muted-foreground text-sm mb-8">Start with a proven framework.</Text>
      <View className="flex-row flex-wrap justify-between">
        {TEMPLATES.map(t => {
          const cat = CATEGORY_CONFIG[t.category];
          return (
            <View key={t.id} className="bg-card border border-border rounded-xl p-4 w-[48%] mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-lg">{cat.icon}</Text>
                <Text className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{cat.label}</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">{t.title}</Text>
              <Text className="text-xs text-muted-foreground my-1">{t.description}</Text>
              <Text className="text-xs text-muted-foreground mb-3">Breakdown: {t.breakdown}</Text>
              <TouchableOpacity
                onPress={() => useTemplate(t.id)}
                className="bg-primary py-2 rounded-lg"
              >
                <Text className="text-primary-foreground text-xs font-medium text-center">Use Template</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
