import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Download, Smartphone, Share2, Check } from 'lucide-react-native';

export default function InstallScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-4 pt-6">
      <View className="items-center">
        <View className="w-20 h-20 bg-card rounded-2xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-4xl">🎯</Text>
        </View>
        <Text className="text-2xl font-bold text-foreground">Install GoalGetter</Text>
        <Text className="text-muted-foreground text-sm text-center my-4">Get the full app experience on your phone.</Text>

        <View className="bg-success/10 border border-success/20 rounded-xl p-6 w-full items-center mb-6">
          <Check size={40} color="hsl(var(--success))" />
          <Text className="text-sm font-medium text-foreground mt-2">GoalGetter is installed!</Text>
          <Text className="text-xs text-muted-foreground">Find it on your home screen.</Text>
        </View>

        <View className="bg-card border border-border rounded-xl p-6 w-full">
          <Smartphone size={40} color="hsl(var(--muted-foreground))" className="mx-auto mb-3" />
          <Text className="text-sm text-foreground font-medium text-center">Open in your browser</Text>
          <Text className="text-xs text-muted-foreground text-center">Visit this page on your phone's browser and use the menu to "Add to Home Screen".</Text>
        </View>
      </View>
    </ScrollView>
  );
}
