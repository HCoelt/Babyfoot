import { AddPlayerForm } from '@/src/components/settings/AddPlayerForm';
import { PlayerList } from '@/src/components/settings/PlayerList';
import { colors } from '@/src/theme';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ListHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 16 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', letterSpacing: 3, color: colors.textMuted, fontSize: 10, marginBottom: 8 }}>
          SETTINGS
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          Manage players and preferences
        </Text>
      </View>
      <AddPlayerForm />
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PlayerList ListHeaderComponent={ListHeader} />
    </View>
  );
}

