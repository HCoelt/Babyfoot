import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllGames,
  getRecentGames,
  createGame,
  deleteGame,
} from '../database/operations/games';
import { CreateGameInput } from '../types/game';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: getAllGames,
  });
}

export function useRecentGames(limit: number = 10) {
  return useQuery({
    queryKey: ['games', 'recent', limit],
    queryFn: () => getRecentGames(limit),
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGameInput) => createGame(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });
}
