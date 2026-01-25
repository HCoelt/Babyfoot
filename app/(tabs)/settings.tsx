import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Divider } from 'react-native-paper';
import { AddPlayerForm } from '@/src/components/settings/AddPlayerForm';
import { PlayerList } from '@/src/components/settings/PlayerList';

function ListHeader() {
  return (
    <>
      <AddPlayerForm />
      <Divider style={styles.divider} />
    </>
  );
}

export default function SettingsScreen() {
  return (
    <Surface style={styles.container}>
      <PlayerList ListHeaderComponent={ListHeader} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
});
