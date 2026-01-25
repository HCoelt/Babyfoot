import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllPlayers,
  getPlayersWithStats,
  createPlayer,
  deletePlayer,
  updatePlayerRating,
} from '../database/operations/players';
import { CreatePlayerInput } from '../types/player';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: getAllPlayers,
  });
}

export function usePlayersWithStats() {
  return useQuery({
    queryKey: ['players', 'withStats'],
    queryFn: getPlayersWithStats,
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlayerInput) => createPlayer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useUpdatePlayerRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newRating }: { id: number; newRating: number }) =>
      updatePlayerRating(id, newRating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
