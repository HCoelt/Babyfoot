import { GameRow } from '../../types/database';
import { CreateGameInput, Game, GameWithPlayers, RatingChange } from '../../types/game';
import { applyRatingChange, calculateEloChanges } from '../../utils/scoring';
import { getDatabase } from '../db';
import { getPlayerById, updatePlayerRating } from './players';

function rowToGame(row: GameRow): Game {
  return {
    id: row.id,
    team1Player1Id: row.team1_player1_id,
    team1Player2Id: row.team1_player2_id,
    team2Player1Id: row.team2_player1_id,
    team2Player2Id: row.team2_player2_id,
    team1Player1Position: row.team1_player1_position,
    team1Player2Position: row.team1_player2_position,
    team2Player1Position: row.team2_player1_position,
    team2Player2Position: row.team2_player2_position,
    team1Score: row.team1_score,
    team2Score: row.team2_score,
    winnerTeam: row.winner_team as 1 | 2,
    playedAt: new Date(row.played_at),
    createdAt: new Date(row.created_at),
  };
}

export async function getAllGames(): Promise<Game[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<GameRow>(
    'SELECT * FROM games ORDER BY played_at DESC'
  );
  return rows.map(rowToGame);
}

export async function getGameById(id: number): Promise<Game | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<GameRow>(
    'SELECT * FROM games WHERE id = ?',
    [id]
  );
  return row ? rowToGame(row) : null;
}

export async function getRecentGames(limit: number = 10): Promise<GameWithPlayers[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      g.*,
      p1.name as team1_player1_name,
      p2.name as team1_player2_name,
      p3.name as team2_player1_name,
      p4.name as team2_player2_name
    FROM games g
    JOIN players p1 ON g.team1_player1_id = p1.id
    JOIN players p2 ON g.team1_player2_id = p2.id
    JOIN players p3 ON g.team2_player1_id = p3.id
    JOIN players p4 ON g.team2_player2_id = p4.id
    ORDER BY g.played_at DESC
    LIMIT ?
  `;

  const rows = await db.getAllAsync<GameRow & {
    team1_player1_name: string;
    team1_player2_name: string;
    team2_player1_name: string;
    team2_player2_name: string;
  }>(query, [limit]);

  return rows.map(row => ({
    ...rowToGame(row),
    team1Player1Name: row.team1_player1_name,
    team1Player2Name: row.team1_player2_name,
    team2Player1Name: row.team2_player1_name,
    team2Player2Name: row.team2_player2_name,
  }));
}

export async function createGame(input: CreateGameInput): Promise<{ game: Game; ratingChanges: RatingChange[] }> {
  const db = await getDatabase();
  const now = Date.now();

  // Validate all 4 players are unique
  const playerIds = [input.team1Player1Id, input.team1Player2Id, input.team2Player1Id, input.team2Player2Id];
  if (new Set(playerIds).size !== 4) {
    throw new Error('All 4 players must be unique');
  }

  // Get current ratings for all players
  const players = await Promise.all(playerIds.map(id => getPlayerById(id)));
  if (players.some(p => p === null)) {
    throw new Error('One or more players not found');
  }

  const [team1Player1, team1Player2, team2Player1, team2Player2] = players as NonNullable<typeof players[0]>[];

  // Calculate team average Elos (for audit)
  const eloTeam1Before = (team1Player1.currentRating + team1Player2.currentRating) / 2;
  const eloTeam2Before = (team2Player1.currentRating + team2Player2.currentRating) / 2;

  // Determine winner
  const winnerTeam = input.team1Score > input.team2Score ? 1 : 2;

  // Calculate rating changes using new algorithm (with scores for multiplier)
  const eloResult = calculateEloChanges(
    { player1Rating: team1Player1.currentRating, player2Rating: team1Player2.currentRating },
    { player1Rating: team2Player1.currentRating, player2Rating: team2Player2.currentRating },
    input.team1Score,
    input.team2Score
  );

  // Determine changes for each team
  const team1Change = winnerTeam === 1 ? eloResult.winnerChange : eloResult.loserChange;
  const team2Change = winnerTeam === 2 ? eloResult.winnerChange : eloResult.loserChange;

  // Insert game with audit fields
  const result = await db.runAsync(
    `INSERT INTO games
      (team1_player1_id, team1_player2_id, team2_player1_id, team2_player2_id,
       team1_player1_position, team1_player2_position, team2_player1_position, team2_player2_position,
       team1_score, team2_score, winner_team,
       elo_team1_before, elo_team2_before, points_delta, score_multiplier,
       played_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.team1Player1Id, input.team1Player2Id,
      input.team2Player1Id, input.team2Player2Id,
      input.team1Player1Position, input.team1Player2Position,
      input.team2Player1Position, input.team2Player2Position,
      input.team1Score, input.team2Score,
      winnerTeam,
      eloTeam1Before, eloTeam2Before,
      eloResult.pointsEffectifs, eloResult.multiplier,
      now, now
    ]
  );

  const gameId = result.lastInsertRowId;

  // Build rating changes for all players
  const playerRatingChanges: RatingChange[] = [
    { playerId: input.team1Player1Id, ratingBefore: team1Player1.currentRating, ratingAfter: applyRatingChange(team1Player1.currentRating, team1Change), change: team1Change },
    { playerId: input.team1Player2Id, ratingBefore: team1Player2.currentRating, ratingAfter: applyRatingChange(team1Player2.currentRating, team1Change), change: team1Change },
    { playerId: input.team2Player1Id, ratingBefore: team2Player1.currentRating, ratingAfter: applyRatingChange(team2Player1.currentRating, team2Change), change: team2Change },
    { playerId: input.team2Player2Id, ratingBefore: team2Player2.currentRating, ratingAfter: applyRatingChange(team2Player2.currentRating, team2Change), change: team2Change },
  ];

  // Update ratings, points_won/points_lost, and record history
  for (const change of playerRatingChanges) {
    // Update player rating (with floor protection applied in applyRatingChange)
    await updatePlayerRating(change.playerId, change.ratingAfter);

    // Update points_won or points_lost
    if (change.change > 0) {
      await db.runAsync(
        `UPDATE players SET points_won = points_won + ?, updated_at = ? WHERE id = ?`,
        [change.change, now, change.playerId]
      );
    } else if (change.change < 0) {
      await db.runAsync(
        `UPDATE players SET points_lost = points_lost + ?, updated_at = ? WHERE id = ?`,
        [Math.abs(change.change), now, change.playerId]
      );
    }

    // Record rating history
    await db.runAsync(
      `INSERT INTO rating_history
        (player_id, game_id, rating_before, rating_after, rating_change, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [change.playerId, gameId, change.ratingBefore, change.ratingAfter, change.change, now]
    );
  }

  const game = await getGameById(gameId);
  if (!game) {
    throw new Error('Failed to create game');
  }

  return { game, ratingChanges: playerRatingChanges };
}

export async function deleteGame(id: number): Promise<void> {
  const db = await getDatabase();

  // Delete rating history first (foreign key constraint)
  await db.runAsync('DELETE FROM rating_history WHERE game_id = ?', [id]);

  // Delete the game
  await db.runAsync('DELETE FROM games WHERE id = ?', [id]);
}
