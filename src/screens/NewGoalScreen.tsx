import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addGoal } from '../lib/goalStore';
import { GoalCategory, GoalLevel, TrackingType, CATEGORY_CONFIG } from '../lib/types';

const LEVELS: GoalLevel[] = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'];
const TRACKING_TYPES: { value: TrackingType; label: string; desc: string }[] = [
  { value: 'numeric', label: 'Numeric', desc: 'Count towards a target' },
  { value: 'binary', label: 'Done / Not Done', desc: 'Simple completion check' },
  { value: 'time', label: 'Time-Based', desc: 'Track minutes or hours' },
  { value: 'rating', label: 'Rating (1–10)', desc: 'Self-rate on a scale' },
];

export default function NewGoalScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('mental');
  const [level, setLevel] = useState<GoalLevel>('weekly');
  const [trackingType, setTrackingType] = useState<TrackingType>('numeric');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    await addGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      level,
      trackingType,
      target: target ? Number(target) : undefined,
      current: 0,
      unit: unit.trim() || undefined,
      completed: false,
    });
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-6">
      <Text className="text-2xl font-bold text-foreground mb-6">Create New Goal</Text>

      {/* Title */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-foreground mb-2">Goal Title</Text>
        <TextInput
          className="bg-card border border-input rounded-xl px-4 py-3 text-foreground"
          placeholder="e.g., Read 12 books this year"
          placeholderTextColor="hsl(var(--muted-foreground))"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-foreground mb-2">Description (optional)</Text>
        <TextInput
          className="bg-card border border-input rounded-xl px-4 py-3 text-foreground min-h-[80px]"
          placeholder="Add context or motivation..."
          placeholderTextColor="hsl(var(--muted-foreground))"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Category */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-foreground mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setCategory(key as GoalCategory)}
              className={`px-3 py-2 rounded-xl border ${category === key ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}
            >
              <Text className={`text-xs font-medium ${category === key ? 'text-foreground' : 'text-muted-foreground'}`}>
                {config.icon} {config.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Level */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-foreground mb-2">Goal Level</Text>
        <View className="flex-row flex-wrap gap-2">
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l}
              onPress={() => setLevel(l)}
              className={`px-4 py-2 rounded-xl border ${level === l ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}
            >
              <Text className={`text-xs font-medium capitalize ${level === l ? 'text-foreground' : 'text-muted-foreground'}`}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tracking Type */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-foreground mb-2">How do you want to track this?</Text>
        {TRACKING_TYPES.map(tt => (
          <TouchableOpacity
            key={tt.value}
            onPress={() => setTrackingType(tt.value)}
            className={`p-3 rounded-xl border mb-2 ${trackingType === tt.value ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}
          >
            <Text className="text-sm font-medium text-foreground">{tt.label}</Text>
            <Text className="text-xs text-muted-foreground">{tt.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Target & Unit */}
      {trackingType !== 'binary' && (
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground mb-2">Target</Text>
            <TextInput
              className="bg-card border border-input rounded-xl px-4 py-3 text-foreground"
              placeholder="e.g., 12"
              placeholderTextColor="hsl(var(--muted-foreground))"
              value={target}
              onChangeText={setTarget}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground mb-2">Unit</Text>
            <TextInput
              className="bg-card border border-input rounded-xl px-4 py-3 text-foreground"
              placeholder="books, dollars, minutes"
              placeholderTextColor="hsl(var(--muted-foreground))"
              value={unit}
              onChangeText={setUnit}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-accent py-4 rounded-xl mb-8"
      >
        <Text className="text-accent-foreground text-center font-semibold">Create Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
