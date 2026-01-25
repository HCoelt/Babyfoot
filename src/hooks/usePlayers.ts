import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPlayer,
  deletePlayer,
  getAllPlayers,
  getPlayersWithStats,
  updatePlayerGamestyle,
  updatePlayerRating,
} from '../database/operations/players';
import { CreatePlayerInput, GameStyle } from '../types/player';

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

export function useUpdatePlayerGamestyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, gamestyle }: { id: number; gamestyle: GameStyle }) =>
      updatePlayerGamestyle(id, gamestyle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
