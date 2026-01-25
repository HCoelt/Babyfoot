export interface PlayerStats {
  playerId: number;
  playerName: string;
  currentRating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgRatingChange: number;
}

export interface PartnerStats {
  partnerId: number;
  partnerName: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export interface OpponentStats {
  opponentId: number;
  opponentName: string;
  gamesPlayed: number;
  winsAgainst: number;
  winRateAgainst: number;
}

export interface RecentPerformance {
  gameId: number;
  playedAt: Date;
  won: boolean;
  ratingChange: number;
  ratingAfter: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: number;
  playerName: string;
  currentRating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}
