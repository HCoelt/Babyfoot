import * as SQLite from 'expo-sqlite';
import { initializeSchema } from './schema';

const DATABASE_NAME = 'babyfoot.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initializeSchema(dbInstance);

  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
