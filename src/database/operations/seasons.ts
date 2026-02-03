import { getDatabase } from '../db';

/**
 * Hard reset all player Elos to 1000 and clear points stats
 * This is a destructive operation used at season end
 * Should always be confirmed with user before calling
 */
export async function hardResetAllElos(): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.execAsync(
        `UPDATE players SET current_rating = 1000.0, points_won = 0, points_lost = 0, updated_at = ${now}`
    );
}
