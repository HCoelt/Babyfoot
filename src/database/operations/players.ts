import { PlayerRow } from '../../types/database';
import { CreatePlayerInput, Player, PlayerWithStats } from '../../types/player';
import { getDatabase } from '../db';

function rowToPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    name: row.name,
    gamestyle: row.gamestyle || 'attack', // Fallback for existing players without gamestyle
    currentRating: row.current_rating,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getAllPlayers(): Promise<Player[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PlayerRow>(
    'SELECT * FROM players ORDER BY name ASC'
  );
  return rows.map(rowToPlayer);
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PlayerRow>(
    'SELECT * FROM players WHERE id = ?',
    [id]
  );
  return row ? rowToPlayer(row) : null;
}

export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  const db = await getDatabase();
  const now = Date.now();

  const result = await db.runAsync(
    'INSERT INTO players (name, gamestyle, current_rating, created_at, updated_at) VALUES (?, ?, 1000.0, ?, ?)',
    [input.name.trim(), input.gamestyle, now, now]
  );

  const player = await getPlayerById(result.lastInsertRowId);
  if (!player) {
    throw new Error('Failed to create player');
  }
  return player;
}

export async function deletePlayer(id: number): Promise<void> {
  const db = await getDatabase();

  // Find all games involving this player
  const games = await db.getAllAsync<{ id: number }>(
    `SELECT id FROM games
     WHERE team1_player1_id = ? OR team1_player2_id = ?
     OR team2_player1_id = ? OR team2_player2_id = ?`,
    [id, id, id, id]
  );

  if (games.length > 0) {
    const gameIds = games.map(g => g.id);
    const gameIdsString = gameIds.join(',');

    // Delete rating history for these games
    await db.runAsync(`DELETE FROM rating_history WHERE game_id IN (${gameIdsString})`);

    // Delete the games themselves
    await db.runAsync(`DELETE FROM games WHERE id IN (${gameIdsString})`);
  }

  // Delete any remaining rating history for this player (orphaned?)
  await db.runAsync('DELETE FROM rating_history WHERE player_id = ?', [id]);

  // Finally delete the player
  await db.runAsync('DELETE FROM players WHERE id = ?', [id]);
}

export async function updatePlayerRating(id: number, newRating: number): Promise<Player> {
  const db = await getDatabase();
  const now = Date.now();

  await db.runAsync(
    'UPDATE players SET current_rating = ?, updated_at = ? WHERE id = ?',
    [newRating, now, id]
  );

  const player = await getPlayerById(id);
  if (!player) {
    throw new Error('Player not found');
  }
  return player;
}

export async function updatePlayerGamestyle(id: number, gamestyle: 'attack' | 'defense'): Promise<Player> {
  const db = await getDatabase();
  const now = Date.now();

  await db.runAsync(
    'UPDATE players SET gamestyle = ?, updated_at = ? WHERE id = ?',
    [gamestyle, now, id]
  );

  const player = await getPlayerById(id);
  if (!player) {
    throw new Error('Player not found');
  }
  return player;
}

export async function getPlayersWithStats(): Promise<PlayerWithStats[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      p.id,
      p.name,
      p.gamestyle,
      p.current_rating,
      p.created_at,
      p.updated_at,
      COALESCE(stats.games_played, 0) as games_played,
      COALESCE(stats.wins, 0) as wins
    FROM players p
    LEFT JOIN (
      SELECT
        player_id,
        COUNT(*) as games_played,
        SUM(won) as wins
      FROM (
        SELECT team1_player1_id as player_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team1_player2_id as player_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team2_player1_id as player_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team2_player2_id as player_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won FROM games
      ) player_games
      GROUP BY player_id
    ) stats ON p.id = stats.player_id
    ORDER BY p.current_rating DESC
  `;

  const rows = await db.getAllAsync<PlayerRow & { games_played: number; wins: number }>(query);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    gamestyle: row.gamestyle || 'attack', // Fallback for existing players without gamestyle
    currentRating: row.current_rating,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    gamesPlayed: row.games_played,
    wins: row.wins,
    losses: row.games_played - row.wins,
    winRate: row.games_played > 0 ? (row.wins / row.games_played) * 100 : 0,
  }));
}
