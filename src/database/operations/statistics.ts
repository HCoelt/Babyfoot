import {
  LeaderboardEntry,
  OpponentStats,
  PartnerStats,
  PlayerStats,
  RecentPerformance,
} from '../../types/statistics';
import { getDatabase } from '../db';

export async function getPlayerStats(playerId: number): Promise<PlayerStats | null> {
  const db = await getDatabase();

  const query = `
    SELECT
      p.id as player_id,
      p.name as player_name,
      p.current_rating,
      COALESCE(stats.games_played, 0) as games_played,
      COALESCE(stats.wins, 0) as wins,
      COALESCE(avg_change.avg_rating_change, 0) as avg_rating_change,
      COALESCE(pos_stats.attack_games, 0) as attack_games,
      COALESCE(pos_stats.attack_wins, 0) as attack_wins,
      COALESCE(pos_stats.defense_games, 0) as defense_games,
      COALESCE(pos_stats.defense_wins, 0) as defense_wins
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
      WHERE player_id = ?
      GROUP BY player_id
    ) stats ON p.id = stats.player_id
    LEFT JOIN (
      SELECT player_id, AVG(rating_change) as avg_rating_change
      FROM rating_history
      WHERE player_id = ?
      GROUP BY player_id
    ) avg_change ON p.id = avg_change.player_id
    LEFT JOIN (
      SELECT
        player_id,
        SUM(CASE WHEN position = 'attack' THEN 1 ELSE 0 END) as attack_games,
        SUM(CASE WHEN position = 'attack' AND won = 1 THEN 1 ELSE 0 END) as attack_wins,
        SUM(CASE WHEN position = 'defense' THEN 1 ELSE 0 END) as defense_games,
        SUM(CASE WHEN position = 'defense' AND won = 1 THEN 1 ELSE 0 END) as defense_wins
      FROM (
        SELECT team1_player1_id as player_id, team1_player1_position as position, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team1_player2_id as player_id, team1_player2_position as position, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team2_player1_id as player_id, team2_player1_position as position, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won FROM games
        UNION ALL
        SELECT team2_player2_id as player_id, team2_player2_position as position, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won FROM games
      ) pos_games
      WHERE player_id = ?
      GROUP BY player_id
    ) pos_stats ON p.id = pos_stats.player_id
    WHERE p.id = ?
  `;

  const row = await db.getFirstAsync<{
    player_id: number;
    player_name: string;
    current_rating: number;
    games_played: number;
    wins: number;
    avg_rating_change: number;
    attack_games: number;
    attack_wins: number;
    defense_games: number;
    defense_wins: number;
  }>(query, [playerId, playerId, playerId, playerId]);

  if (!row) return null;

  const losses = row.games_played - row.wins;
  return {
    playerId: row.player_id,
    playerName: row.player_name,
    currentRating: row.current_rating,
    gamesPlayed: row.games_played,
    wins: row.wins,
    losses,
    winRate: row.games_played > 0 ? (row.wins / row.games_played) * 100 : 0,
    avgRatingChange: row.avg_rating_change,
    attack: {
      gamesPlayed: row.attack_games,
      wins: row.attack_wins,
      winRate: row.attack_games > 0 ? (row.attack_wins / row.attack_games) * 100 : 0,
    },
    defense: {
      gamesPlayed: row.defense_games,
      wins: row.defense_wins,
      winRate: row.defense_games > 0 ? (row.defense_wins / row.defense_games) * 100 : 0,
    },
  };
}

export async function getBestPartners(playerId: number, limit: number = 5): Promise<PartnerStats[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      partner_id,
      p.name as partner_name,
      COUNT(*) as games_played,
      SUM(won) as wins
    FROM (
      -- Games where player is team1_player1
      SELECT team1_player2_id as partner_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won
      FROM games WHERE team1_player1_id = ?
      UNION ALL
      -- Games where player is team1_player2
      SELECT team1_player1_id as partner_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won
      FROM games WHERE team1_player2_id = ?
      UNION ALL
      -- Games where player is team2_player1
      SELECT team2_player2_id as partner_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won
      FROM games WHERE team2_player1_id = ?
      UNION ALL
      -- Games where player is team2_player2
      SELECT team2_player1_id as partner_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won
      FROM games WHERE team2_player2_id = ?
    ) partner_games
    JOIN players p ON partner_games.partner_id = p.id
    GROUP BY partner_id
    HAVING games_played >= 1
    ORDER BY (CAST(wins AS REAL) / games_played) DESC, games_played DESC
    LIMIT ?
  `;

  const rows = await db.getAllAsync<{
    partner_id: number;
    partner_name: string;
    games_played: number;
    wins: number;
  }>(query, [playerId, playerId, playerId, playerId, limit]);

  return rows.map(row => ({
    partnerId: row.partner_id,
    partnerName: row.partner_name,
    gamesPlayed: row.games_played,
    wins: row.wins,
    winRate: row.games_played > 0 ? (row.wins / row.games_played) * 100 : 0,
  }));
}

export async function getToughestOpponents(playerId: number, limit: number = 5): Promise<OpponentStats[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      opponent_id,
      p.name as opponent_name,
      COUNT(*) as games_played,
      SUM(won) as wins_against
    FROM (
      -- Games where player is on team1, opponents are team2
      SELECT team2_player1_id as opponent_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won
      FROM games WHERE team1_player1_id = ? OR team1_player2_id = ?
      UNION ALL
      SELECT team2_player2_id as opponent_id, CASE WHEN winner_team = 1 THEN 1 ELSE 0 END as won
      FROM games WHERE team1_player1_id = ? OR team1_player2_id = ?
      UNION ALL
      -- Games where player is on team2, opponents are team1
      SELECT team1_player1_id as opponent_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won
      FROM games WHERE team2_player1_id = ? OR team2_player2_id = ?
      UNION ALL
      SELECT team1_player2_id as opponent_id, CASE WHEN winner_team = 2 THEN 1 ELSE 0 END as won
      FROM games WHERE team2_player1_id = ? OR team2_player2_id = ?
    ) opponent_games
    JOIN players p ON opponent_games.opponent_id = p.id
    WHERE opponent_id != ?
    GROUP BY opponent_id
    HAVING games_played >= 1
    ORDER BY (CAST(wins_against AS REAL) / games_played) ASC, games_played DESC
    LIMIT ?
  `;

  const rows = await db.getAllAsync<{
    opponent_id: number;
    opponent_name: string;
    games_played: number;
    wins_against: number;
  }>(query, [playerId, playerId, playerId, playerId, playerId, playerId, playerId, playerId, playerId, limit]);

  return rows.map(row => ({
    opponentId: row.opponent_id,
    opponentName: row.opponent_name,
    gamesPlayed: row.games_played,
    winsAgainst: row.wins_against,
    winRateAgainst: row.games_played > 0 ? (row.wins_against / row.games_played) * 100 : 0,
  }));
}

export async function getRecentPerformance(playerId: number, limit: number = 10): Promise<RecentPerformance[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      rh.game_id,
      g.played_at,
      rh.rating_change,
      rh.rating_after,
      CASE
        WHEN (g.team1_player1_id = ? OR g.team1_player2_id = ?) AND g.winner_team = 1 THEN 1
        WHEN (g.team2_player1_id = ? OR g.team2_player2_id = ?) AND g.winner_team = 2 THEN 1
        ELSE 0
      END as won
    FROM rating_history rh
    JOIN games g ON rh.game_id = g.id
    WHERE rh.player_id = ?
    ORDER BY g.played_at DESC
    LIMIT ?
  `;

  const rows = await db.getAllAsync<{
    game_id: number;
    played_at: number;
    rating_change: number;
    rating_after: number;
    won: number;
  }>(query, [playerId, playerId, playerId, playerId, playerId, limit]);

  return rows.map(row => ({
    gameId: row.game_id,
    playedAt: new Date(row.played_at),
    won: row.won === 1,
    ratingChange: row.rating_change,
    ratingAfter: row.rating_after,
  }));
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const db = await getDatabase();

  const query = `
    SELECT
      p.id as player_id,
      p.name as player_name,
      p.current_rating,
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

  const rows = await db.getAllAsync<{
    player_id: number;
    player_name: string;
    current_rating: number;
    games_played: number;
    wins: number;
  }>(query);

  return rows.map((row, index) => ({
    rank: index + 1,
    playerId: row.player_id,
    playerName: row.player_name,
    currentRating: row.current_rating,
    gamesPlayed: row.games_played,
    wins: row.wins,
    losses: row.games_played - row.wins,
    winRate: row.games_played > 0 ? (row.wins / row.games_played) * 100 : 0,
  }));
}

export async function getRatingHistory(playerId: number): Promise<{ date: Date; rating: number }[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    created_at: number;
    rating_after: number;
  }>(
    `SELECT created_at, rating_after 
     FROM rating_history 
     WHERE player_id = ? 
     ORDER BY created_at ASC`,
    [playerId]
  );

  if (rows.length === 0) {
    return [{ date: new Date(), rating: 1000 }];
  }

  return rows.map(row => ({
    date: new Date(row.created_at),
    rating: row.rating_after
  }));
}
