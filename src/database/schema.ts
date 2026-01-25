import * as SQLite from 'expo-sqlite';

export const SCHEMA_VERSION = 1;

const CREATE_PLAYERS_TABLE = `
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  current_rating REAL DEFAULT 1000.0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

const CREATE_GAMES_TABLE = `
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team1_player1_id INTEGER NOT NULL,
  team1_player2_id INTEGER NOT NULL,
  team2_player1_id INTEGER NOT NULL,
  team2_player2_id INTEGER NOT NULL,
  team1_score INTEGER NOT NULL,
  team2_score INTEGER NOT NULL,
  winner_team INTEGER NOT NULL CHECK(winner_team IN (1, 2)),
  played_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (team1_player1_id) REFERENCES players(id),
  FOREIGN KEY (team1_player2_id) REFERENCES players(id),
  FOREIGN KEY (team2_player1_id) REFERENCES players(id),
  FOREIGN KEY (team2_player2_id) REFERENCES players(id)
);
`;

const CREATE_RATING_HISTORY_TABLE = `
CREATE TABLE IF NOT EXISTS rating_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL,
  rating_before REAL NOT NULL,
  rating_after REAL NOT NULL,
  rating_change REAL NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);
`;

const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_games_played_at ON games(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_team1_players ON games(team1_player1_id, team1_player2_id);
CREATE INDEX IF NOT EXISTS idx_games_team2_players ON games(team2_player1_id, team2_player2_id);
CREATE INDEX IF NOT EXISTS idx_rating_history_player ON rating_history(player_id, created_at DESC);
`;

export async function initializeSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(CREATE_PLAYERS_TABLE);
  await db.execAsync(CREATE_GAMES_TABLE);
  await db.execAsync(CREATE_RATING_HISTORY_TABLE);

  // Create indexes (split by semicolon and execute each)
  const indexStatements = CREATE_INDEXES.split(';').filter(s => s.trim());
  for (const statement of indexStatements) {
    await db.execAsync(statement);
  }
}
