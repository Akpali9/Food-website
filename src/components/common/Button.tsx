import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export const Button = ({ title, onPress, loading, variant = 'primary', className = '' }: any) => {
  const bg = variant === 'primary' ? 'bg-accent' : 'bg-secondary';
  const textColor = variant === 'primary' ? 'text-accent-foreground' : 'text-secondary-foreground';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`px-4 py-3 rounded-xl ${bg} ${className} ${loading ? 'opacity-60' : ''}`}
    >
      {loading ? <ActivityIndicator color="hsl(var(--accent-foreground))" /> : <Text className={`font-semibold text-center ${textColor}`}>{title}</Text>}
    </TouchableOpacity>
  );
};
