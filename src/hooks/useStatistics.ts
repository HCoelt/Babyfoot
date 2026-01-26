import { useQuery } from '@tanstack/react-query';
import {
  getBestPartners,
  getLeaderboard,
  getPlayerStats,
  getRatingHistory,
  getRecentPerformance,
  getToughestOpponents,
} from '../database/operations/statistics';

export function usePlayerStats(playerId: number | null) {
  return useQuery({
    queryKey: ['statistics', 'player', playerId],
    queryFn: () => (playerId ? getPlayerStats(playerId) : null),
    enabled: playerId !== null,
  });
}

export function useRatingHistory(playerId: number | null) {
  return useQuery({
    queryKey: ['statistics', 'history', playerId],
    queryFn: () => (playerId ? getRatingHistory(playerId) : []),
    enabled: playerId !== null,
  });
}

export function useBestPartners(playerId: number | null, limit: number = 5) {
  return useQuery({
    queryKey: ['statistics', 'partners', playerId, limit],
    queryFn: () => (playerId ? getBestPartners(playerId, limit) : []),
    enabled: playerId !== null,
  });
}

export function useToughestOpponents(playerId: number | null, limit: number = 5) {
  return useQuery({
    queryKey: ['statistics', 'opponents', playerId, limit],
    queryFn: () => (playerId ? getToughestOpponents(playerId, limit) : []),
    enabled: playerId !== null,
  });
}

export function useRecentPerformance(playerId: number | null, limit: number = 10) {
  return useQuery({
    queryKey: ['statistics', 'performance', playerId, limit],
    queryFn: () => (playerId ? getRecentPerformance(playerId, limit) : []),
    enabled: playerId !== null,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });
}
