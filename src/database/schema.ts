import * as SQLite from 'expo-sqlite';

export const SCHEMA_VERSION = 4;

const CREATE_PLAYERS_TABLE = `
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  gamestyle TEXT NOT NULL DEFAULT 'attack' CHECK(gamestyle IN ('attack', 'defense')),
  current_rating REAL DEFAULT 1000.0,
  points_won INTEGER DEFAULT 0,
  points_lost INTEGER DEFAULT 0,
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
  team1_player1_position TEXT NOT NULL CHECK(team1_player1_position IN ('attack', 'defense')),
  team1_player2_position TEXT NOT NULL CHECK(team1_player2_position IN ('attack', 'defense')),
  team2_player1_position TEXT NOT NULL CHECK(team2_player1_position IN ('attack', 'defense')),
  team2_player2_position TEXT NOT NULL CHECK(team2_player2_position IN ('attack', 'defense')),
  team1_score INTEGER NOT NULL,
  team2_score INTEGER NOT NULL,
  winner_team INTEGER NOT NULL CHECK(winner_team IN (1, 2)),
  elo_team1_before REAL,
  elo_team2_before REAL,
  points_delta INTEGER,
  score_multiplier REAL,
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

const CREATE_SEASONS_TABLE = `
CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date_start INTEGER NOT NULL,
  date_end INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);
`;

const CREATE_PARTNER_VICTORIES_TABLE = `
CREATE TABLE IF NOT EXISTS partner_victories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  partner_id INTEGER NOT NULL,
  victories INTEGER DEFAULT 0,
  UNIQUE(player_id, partner_id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (partner_id) REFERENCES players(id)
);
`;

const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_games_played_at ON games(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_team1_players ON games(team1_player1_id, team1_player2_id);
CREATE INDEX IF NOT EXISTS idx_games_team2_players ON games(team2_player1_id, team2_player2_id);
CREATE INDEX IF NOT EXISTS idx_rating_history_player ON rating_history(player_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_victories_player ON partner_victories(player_id);
`;

async function getSchemaVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  try {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    return result?.user_version ?? 0;
  } catch {
    return 0;
  }
}

async function setSchemaVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  await db.execAsync(`PRAGMA user_version = ${version}`);
}

async function migrateToV2(db: SQLite.SQLiteDatabase): Promise<void> {
  // Check if gamestyle column exists
  const tableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(players)');
  const hasGamestyleColumn = tableInfo.some(col => col.name === 'gamestyle');

  if (!hasGamestyleColumn) {
    // Add gamestyle column with default value 'attack'
    // Note: SQLite ALTER TABLE doesn't support CHECK constraints, so we add without it
    // The constraint is enforced at the application level
    await db.execAsync("ALTER TABLE players ADD COLUMN gamestyle TEXT DEFAULT 'attack'");
    // Update any NULL values to 'attack'
    await db.execAsync("UPDATE players SET gamestyle = 'attack' WHERE gamestyle IS NULL");
  }
}

async function migrateToV3(db: SQLite.SQLiteDatabase): Promise<void> {
  // Check if team1_player1_position column exists
  const tableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(games)');
  const hasPositionColumn = tableInfo.some(col => col.name === 'team1_player1_position');

  if (!hasPositionColumn) {
    // Add position columns with defaults corresponding to implicit positions
    await db.execAsync("ALTER TABLE games ADD COLUMN team1_player1_position TEXT DEFAULT 'attack'");
    await db.execAsync("ALTER TABLE games ADD COLUMN team1_player2_position TEXT DEFAULT 'defense'");
    await db.execAsync("ALTER TABLE games ADD COLUMN team2_player1_position TEXT DEFAULT 'attack'");
    await db.execAsync("ALTER TABLE games ADD COLUMN team2_player2_position TEXT DEFAULT 'defense'");
  }
}

async function migrateToV4(db: SQLite.SQLiteDatabase): Promise<void> {
  // Add new columns to players table
  const playersInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(players)');
  const hasPointsWon = playersInfo.some(col => col.name === 'points_won');

  if (!hasPointsWon) {
    await db.execAsync("ALTER TABLE players ADD COLUMN points_won INTEGER DEFAULT 0");
    await db.execAsync("ALTER TABLE players ADD COLUMN points_lost INTEGER DEFAULT 0");
  }

  // Add new columns to games table
  const gamesInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(games)');
  const hasEloTeam1Before = gamesInfo.some(col => col.name === 'elo_team1_before');

  if (!hasEloTeam1Before) {
    await db.execAsync("ALTER TABLE games ADD COLUMN elo_team1_before REAL");
    await db.execAsync("ALTER TABLE games ADD COLUMN elo_team2_before REAL");
    await db.execAsync("ALTER TABLE games ADD COLUMN points_delta INTEGER");
    await db.execAsync("ALTER TABLE games ADD COLUMN score_multiplier REAL");
  }

  // Create seasons table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date_start INTEGER NOT NULL,
      date_end INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL
    );
  `);

  // Create partner_victories table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS partner_victories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      partner_id INTEGER NOT NULL,
      victories INTEGER DEFAULT 0,
      UNIQUE(player_id, partner_id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      FOREIGN KEY (partner_id) REFERENCES players(id)
    );
  `);

  // Create index for partner_victories
  await db.execAsync("CREATE INDEX IF NOT EXISTS idx_partner_victories_player ON partner_victories(player_id)");
}

export async function initializeSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersion = await getSchemaVersion(db);

  // Create tables if they don't exist
  await db.execAsync(CREATE_PLAYERS_TABLE);
  await db.execAsync(CREATE_GAMES_TABLE);
  await db.execAsync(CREATE_RATING_HISTORY_TABLE);
  await db.execAsync(CREATE_SEASONS_TABLE);
  await db.execAsync(CREATE_PARTNER_VICTORIES_TABLE);

  // Create indexes (split by semicolon and execute each)
  const indexStatements = CREATE_INDEXES.split(';').filter(s => s.trim());
  for (const statement of indexStatements) {
    await db.execAsync(statement);
  }

  // Run migrations
  if (currentVersion < 2) {
    await migrateToV2(db);
  }
  if (currentVersion < 3) {
    await migrateToV3(db);
  }
  if (currentVersion < 4) {
    await migrateToV4(db);
  }

  // Update schema version
  await setSchemaVersion(db, SCHEMA_VERSION);
}

/**
 * Hard reset all player Elos to 1000
 * This is a destructive operation used at season end
 */
export async function hardResetAllElos(db: SQLite.SQLiteDatabase): Promise<void> {
  const now = Date.now();
  await db.execAsync(`UPDATE players SET current_rating = 1000.0, points_won = 0, points_lost = 0, updated_at = ${now}`);
}
