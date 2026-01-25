import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Button, Text, Snackbar, useTheme, Card } from 'react-native-paper';
import { TeamSelector } from '@/src/components/scoring/TeamSelector';
import { ScoreInput } from '@/src/components/scoring/ScoreInput';
import { usePlayers } from '@/src/hooks/usePlayers';
import { useCreateGame } from '@/src/hooks/useGames';
import { useGameFormStore } from '@/src/store/gameFormStore';
import { formatRatingChange } from '@/src/utils/scoring';

export default function NewGameScreen() {
  const theme = useTheme();
  const { data: players = [], isLoading } = usePlayers();
  const createGame = useCreateGame();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [lastResult, setLastResult] = React.useState<{
    winnerTeam: 1 | 2;
    team1Change: number;
    team2Change: number;
  } | null>(null);

  const {
    team1Player1Id,
    team1Player2Id,
    team2Player1Id,
    team2Player2Id,
    team1Score,
    team2Score,
    setTeam1Player1,
    setTeam1Player2,
    setTeam2Player1,
    setTeam2Player2,
    setTeam1Score,
    setTeam2Score,
    reset,
    getSelectedPlayerIds,
    isValid,
  } = useGameFormStore();

  const handleSaveGame = async () => {
    if (!isValid()) return;

    try {
      const result = await createGame.mutateAsync({
        team1Player1Id: team1Player1Id!,
        team1Player2Id: team1Player2Id!,
        team2Player1Id: team2Player1Id!,
        team2Player2Id: team2Player2Id!,
        team1Score: parseInt(team1Score, 10),
        team2Score: parseInt(team2Score, 10),
      });

      const winnerTeam = parseInt(team1Score, 10) > parseInt(team2Score, 10) ? 1 : 2;
      const team1Change = result.ratingChanges[0]?.change || 0;
      const team2Change = result.ratingChanges[2]?.change || 0;

      setLastResult({ winnerTeam, team1Change, team2Change });
      setSnackbarMessage('Game saved successfully!');
      setSnackbarVisible(true);
      reset();
    } catch (error) {
      setSnackbarMessage(error instanceof Error ? error.message : 'Failed to save game');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </Surface>
    );
  }

  if (players.length < 4) {
    return (
      <Surface style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Not Enough Players
          </Text>
          <Text style={styles.emptyText}>
            You need at least 4 players to record a game.{'\n'}
            Go to Settings to add players.
          </Text>
        </View>
      </Surface>
    );
  }

  const selectedIds = getSelectedPlayerIds();

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TeamSelector
          teamNumber={1}
          player1Id={team1Player1Id}
          player2Id={team1Player2Id}
          players={players}
          allSelectedIds={selectedIds}
          onPlayer1Change={setTeam1Player1}
          onPlayer2Change={setTeam1Player2}
          disabled={createGame.isPending}
        />

        <TeamSelector
          teamNumber={2}
          player1Id={team2Player1Id}
          player2Id={team2Player2Id}
          players={players}
          allSelectedIds={selectedIds}
          onPlayer1Change={setTeam2Player1}
          onPlayer2Change={setTeam2Player2}
          disabled={createGame.isPending}
        />

        <ScoreInput
          team1Score={team1Score}
          team2Score={team2Score}
          onTeam1ScoreChange={setTeam1Score}
          onTeam2ScoreChange={setTeam2Score}
          disabled={createGame.isPending}
        />

        {lastResult && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.resultTitle}>
                Last Game Result
              </Text>
              <Text>
                Team {lastResult.winnerTeam} won!
              </Text>
              <Text style={{ color: lastResult.team1Change >= 0 ? theme.colors.primary : theme.colors.error }}>
                Team 1: {formatRatingChange(lastResult.team1Change)} rating
              </Text>
              <Text style={{ color: lastResult.team2Change >= 0 ? theme.colors.primary : theme.colors.error }}>
                Team 2: {formatRatingChange(lastResult.team2Change)} rating
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveGame}
            disabled={!isValid() || createGame.isPending}
            loading={createGame.isPending}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            Save Game
          </Button>
          <Button
            mode="outlined"
            onPress={reset}
            disabled={createGame.isPending}
            style={styles.resetButton}
          >
            Reset
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  resultCard: {
    marginTop: 16,
    backgroundColor: 'rgba(103, 80, 164, 0.1)',
  },
  resultTitle: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    borderRadius: 8,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  resetButton: {
    borderRadius: 8,
  },
});
