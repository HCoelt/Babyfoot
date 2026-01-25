import { useEffect, useState } from 'react';
import { getDatabase } from '../database/db';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initDb() {
      try {
        await getDatabase();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      }
    }

    initDb();
  }, []);

  return { isReady, error };
}
