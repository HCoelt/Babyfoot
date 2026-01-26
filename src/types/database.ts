// Database row types matching SQLite schema

export interface PlayerRow {
  id: number;
  name: string;
  gamestyle: 'attack' | 'defense';
  current_rating: number;
  created_at: number;
  updated_at: number;
}

export interface GameRow {
  id: number;
  team1_player1_id: number;
  team1_player2_id: number;
  team2_player1_id: number;
  team2_player2_id: number;
  team1_player1_position: 'attack' | 'defense';
  team1_player2_position: 'attack' | 'defense';
  team2_player1_position: 'attack' | 'defense';
  team2_player2_position: 'attack' | 'defense';
  team1_score: number;
  team2_score: number;
  winner_team: 1 | 2;
  played_at: number;
  created_at: number;
}

export interface RatingHistoryRow {
  id: number;
  player_id: number;
  game_id: number;
  rating_before: number;
  rating_after: number;
  rating_change: number;
  created_at: number;
}
