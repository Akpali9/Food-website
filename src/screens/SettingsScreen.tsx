import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Moon, Sun, Download, Shield, Globe, CreditCard } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { getUserCurrency } from '../lib/currency';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [dark, setDark] = useState(false); // We'll manage theme via context later
  const currency = getUserCurrency();

  const handleExport = () => {
    Alert.alert('Export Data', 'Export your goals as CSV?');
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade', 'Pro feature coming soon.');
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-6">
      <Text className="text-2xl font-bold text-foreground mb-8">Settings</Text>

      {/* Theme */}
      <View className="bg-card border border-border rounded-xl p-5 flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          {dark ? <Moon size={20} color="hsl(var(--accent))" /> : <Sun size={20} color="hsl(var(--accent))" />}
          <View>
            <Text className="text-sm font-medium text-foreground">Appearance</Text>
            <Text className="text-xs text-muted-foreground">{dark ? 'Dark' : 'Light'} mode</Text>
          </View>
        </View>
        <Switch value={dark} onValueChange={setDark} trackColor={{ false: 'hsl(var(--muted))', true: 'hsl(var(--accent))' }} />
      </View>

      {/* Currency */}
      <View className="bg-card border border-border rounded-xl p-5 flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          <Globe size={20} color="hsl(var(--accent))" />
          <View>
            <Text className="text-sm font-medium text-foreground">Currency</Text>
            <Text className="text-xs text-muted-foreground">Auto-detected: {currency.symbol} ({currency.code})</Text>
          </View>
        </View>
      </View>

      {/* Export */}
      <View className="bg-card border border-border rounded-xl p-5 flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          <Download size={20} color="hsl(var(--muted-foreground))" />
          <View>
            <Text className="text-sm font-medium text-foreground">Export Data</Text>
            <Text className="text-xs text-muted-foreground">Download your goals as CSV</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleExport} className="bg-secondary px-4 py-2 rounded-lg">
          <Text className="text-secondary-foreground text-xs font-medium">Export</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy */}
      <View className="bg-card border border-border rounded-xl p-5 flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          <Shield size={20} color="hsl(var(--muted-foreground))" />
          <View>
            <Text className="text-sm font-medium text-foreground">Privacy</Text>
            <Text className="text-xs text-muted-foreground">Your data stays on your device.</Text>
          </View>
        </View>
      </View>

      {/* Upgrade */}
      <View className="bg-accent rounded-2xl p-6 items-center mb-6">
        <CreditCard size={32} color="hsl(var(--accent-foreground))" />
        <Text className="text-xl font-bold text-accent-foreground mt-2">Upgrade to Pro</Text>
        <Text className="text-sm text-accent-foreground/80 text-center my-2">Unlock unlimited goals, advanced analytics, and more.</Text>
        <Text className="text-3xl font-black text-accent-foreground">₦10,000<Text className="text-sm font-normal">/month</Text></Text>
        <TouchableOpacity onPress={handleUpgrade} className="bg-card px-8 py-3 rounded-xl mt-4">
          <Text className="text-foreground font-bold">Upgrade Now</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={signOut} className="bg-destructive py-3 rounded-xl mb-8">
        <Text className="text-destructive-foreground text-center font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
