export interface Player {
  id: number;
  name: string;
  currentRating: number;
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
}

export interface UpdatePlayerRatingInput {
  id: number;
  newRating: number;
}
