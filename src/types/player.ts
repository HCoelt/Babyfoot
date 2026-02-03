export type GameStyle = 'attack' | 'defense';

export interface Player {
  id: number;
  name: string;
  gamestyle: GameStyle;
  currentRating: number;
  pointsWon: number;
  pointsLost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerWithStats extends Player {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface CreatePlayerInput {
  name: string;
  gamestyle: GameStyle;
}

export interface UpdatePlayerRatingInput {
  id: number;
  newRating: number;
}
