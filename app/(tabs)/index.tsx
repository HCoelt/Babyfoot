import { TeamCard } from '@/src/components/scoring/TeamCard';
import { GlassCard } from '@/src/components/ui';
import { useCreateGame } from '@/src/hooks/useGames';
import { usePlayers } from '@/src/hooks/usePlayers';
import { useGameFormStore } from '@/src/store/gameFormStore';
import { borderRadius, colors } from '@/src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, Pressable, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewGameScreen() {
  const { data: players = [], isLoading } = usePlayers();
  const createGame = useCreateGame();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [lastResult, setLastResult] = React.useState<{
    winnerTeam: 1 | 2;
    team1Change: number;
    team2Change: number;
  } | null>(null);

  const insets = useSafeAreaInsets();
  const [team1Score, setTeam1Score] = React.useState(0);
  const [team2Score, setTeam2Score] = React.useState(0);

  const {
    team1Player1Id,
    team1Player2Id,
    team2Player1Id,
    team2Player2Id,
    setTeam1Player1,
    setTeam1Player2,
    setTeam2Player1,
    setTeam2Player2,
    reset: resetPlayers,
    getSelectedPlayerIds,
  } = useGameFormStore();

  const handleSwapTeams = () => {
    const temp1 = team1Player1Id;
    const temp2 = team1Player2Id;
    setTeam1Player1(team2Player1Id);
    setTeam1Player2(team2Player2Id);
    setTeam2Player1(temp1);
    setTeam2Player2(temp2);
    setTeam1Score(0);
    setTeam2Score(0);
  };

  const reset = () => {
    resetPlayers();
    setTeam1Score(0);
    setTeam2Score(0);
    setLastResult(null);
  };

  const isValid = () => {
    if (!team1Player1Id || !team1Player2Id || !team2Player1Id || !team2Player2Id) return false;
    const playerIds = [team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id];
    if (new Set(playerIds).size !== 4) return false;
    if (team1Score === team2Score) return false;
    return true;
  };

  const handleSaveGame = async () => {
    if (!isValid()) return;
    try {
      const result = await createGame.mutateAsync({
        team1Player1Id: team1Player1Id!,
        team1Player2Id: team1Player2Id!,
        team2Player1Id: team2Player1Id!,
        team2Player2Id: team2Player2Id!,
        team1Score,
        team2Score,
      });
      const winnerTeam = team1Score > team2Score ? 1 : 2;
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors?.background || '#0A0A0F' }}>
        <ActivityIndicator size="large" color={colors?.red?.primary || '#E53935'} />
      </View>
    );
  }

  if (players.length < 4) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors?.background || '#0A0A0F' }}>
        <GlassCard style={{ padding: 24, alignItems: 'center' }}>
          <Text variant="headlineSmall" style={{ marginBottom: 16, textAlign: 'center', fontWeight: 'bold', color: colors?.text || '#FFF' }}>Not Enough Players</Text>
          <Text style={{ textAlign: 'center', lineHeight: 22, color: colors?.textSecondary || '#AAA' }}>You need at least 4 players.</Text>
        </GlassCard>
      </View>
    );
  }

  const selectedIds = getSelectedPlayerIds();
  const height = Dimensions.get('window').height;
  const isSmallScreen = height < 750;

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors?.background || '#0A0A0F',
      paddingTop: insets.top + 4, // Reduced top padding
      paddingBottom: insets.bottom + 56, // Reduced bottom padding (enough for tab bar)
      paddingHorizontal: 16,
      overflow: 'hidden' // Ensure it clips if needed
    }}>

      {/* Header - Very Compact */}
      <View style={{ marginBottom: isSmallScreen ? 4 : 8, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', letterSpacing: 3, color: colors?.textMuted || '#888', fontSize: 10 }}>
          MATCH ENTRY
        </Text>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1, gap: 4 }}>
        <TeamCard
          teamType="red"
          teamLabel="HOME"
          score={team1Score}
          player1Id={team1Player1Id}
          player2Id={team1Player2Id}
          players={players}
          allSelectedIds={selectedIds}
          onPlayer1Change={setTeam1Player1}
          onPlayer2Change={setTeam1Player2}
          onScoreChange={setTeam1Score}
          disabled={createGame.isPending}
        />

        {/* Swap Button - Overlay on the seam */}
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center', marginTop: -18, zIndex: 10 }}>
          <Pressable
            onPress={handleSwapTeams}
            disabled={createGame.isPending}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#0A0A0F',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: createGame.isPending ? 0.5 : 1,
            }}
          >
            <MaterialCommunityIcons name="swap-vertical" size={20} color={colors?.text || '#FFF'} />
          </Pressable>
        </View>

        <TeamCard
          teamType="blue"
          teamLabel="AWAY"
          score={team2Score}
          player1Id={team2Player1Id}
          player2Id={team2Player2Id}
          players={players}
          allSelectedIds={selectedIds}
          onPlayer1Change={setTeam2Player1}
          onPlayer2Change={setTeam2Player2}
          onScoreChange={setTeam2Score}
          disabled={createGame.isPending}
        />
      </View>

      {/* Submit Button - Compact */}
      <View style={{ marginTop: 8 }}>
        <Pressable
          onPress={handleSaveGame}
          disabled={!isValid() || createGame.isPending}
          style={{
            backgroundColor: isValid() && !createGame.isPending
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.08)',
            borderRadius: borderRadius?.lg || 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isValid() && !createGame.isPending ? 1 : 0.5,
          }}
        >
          <Text style={{ color: colors?.text || '#FFF', fontWeight: '600', fontSize: 13, letterSpacing: 1, marginRight: 8 }}>
            SUBMIT MATCH
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={colors?.text || '#FFF'} />
        </Pressable>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ marginBottom: 80 }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
