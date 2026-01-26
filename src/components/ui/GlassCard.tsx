import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'red' | 'blue';
  intensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  variant = 'default',
  intensity = 'medium',
  noPadding = false,
  transparent = false,
}: GlassCardProps & { transparent?: boolean }) {
  // Determine variant classes
  let variantClasses = transparent ? "bg-transparent border-card-border" : "bg-card border-card-border";
  if (variant === 'red') {
    variantClasses = "bg-red-transparent border-red-glow";
  } else if (variant === 'blue') {
    variantClasses = "bg-blue-transparent border-blue-glow";
  }

  const getBlurIntensity = () => {
    if (transparent) return 0;
    const base = 20;
    switch (intensity) {
      case 'low': return base * 0.5;
      case 'high': return base * 1.5;
      default: return base;
    }
  };

  const containerClasses = `border rounded-lg overflow-hidden ${variantClasses}`;

  if (Platform.OS === 'web') {
    return (
      <View
        className={`${containerClasses} ${!noPadding ? 'p-4' : ''}`}
        style={style}
      >
        {children}
      </View>
    );
  }

  return (
    <View className={containerClasses} style={style}>
      <BlurView
        intensity={getBlurIntensity()}
        tint="dark"
        style={{ flex: 1, padding: noPadding ? 0 : 16 }}
      >
        {children}
      </BlurView>
    </View>
  );
}

