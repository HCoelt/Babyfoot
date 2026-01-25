export interface Game {
  id: number;
  team1Player1Id: number;
  team1Player2Id: number;
  team2Player1Id: number;
  team2Player2Id: number;
  team1Score: number;
  team2Score: number;
  winnerTeam: 1 | 2;
  playedAt: Date;
  createdAt: Date;
}

export interface GameWithPlayers extends Game {
  team1Player1Name: string;
  team1Player2Name: string;
  team2Player1Name: string;
  team2Player2Name: string;
}

export interface CreateGameInput {
  team1Player1Id: number;
  team1Player2Id: number;
  team2Player1Id: number;
  team2Player2Id: number;
  team1Score: number;
  team2Score: number;
}

export interface RatingChange {
  playerId: number;
  ratingBefore: number;
  ratingAfter: number;
  change: number;
}
