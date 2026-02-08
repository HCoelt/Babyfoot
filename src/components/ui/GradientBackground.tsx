import React from 'react';
import { View, ViewStyle } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <View className="flex-1 relative bg-black" style={style}>
      {children}
    </View>
  );
}

