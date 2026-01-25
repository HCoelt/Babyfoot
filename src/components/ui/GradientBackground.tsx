import { gradients } from '@/src/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <SafeAreaView className="flex-1 relative" style={style}>
      <LinearGradient
        colors={gradients.primary as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </SafeAreaView>
  );
}

