// New Elo rating system for 2v2 team games
// Algorithm based on bounded points with score multiplier

// Constants
export const INITIAL_ELO = 1000;
export const MIN_ELO = 0; // Floor protection
export const MIN_POINTS = 10;
export const MAX_POINTS = 100;
export const BASE_POINTS = 50;
export const ELO_DIVISOR = 20;

interface TeamRatings {
  player1Rating: number;
  player2Rating: number;
}

export interface EloResult {
  winnerChange: number;
  loserChange: number;
  basePoints: number;
  multiplier: number;
  pointsEffectifs: number;
}

/**
 * Calculate the average rating of a team
 */
export function getTeamRating(team: TeamRatings): number {
  return (team.player1Rating + team.player2Rating) / 2;
}

/**
 * Calculate base points from the Elo difference
 * Formula: P_raw = 50 + (ELO_loser - ELO_winner) / 20
 * Clamped between 10 and 100
 * 
 * - Beating a stronger team gives more points
 * - Beating a weaker team gives fewer points
 */
export function calculateBasePoints(winnerElo: number, loserElo: number): number {
  const rawPoints = BASE_POINTS + (loserElo - winnerElo) / ELO_DIVISOR;
  return Math.round(Math.max(MIN_POINTS, Math.min(MAX_POINTS, rawPoints)));
}

/**
 * Get score multiplier based on score difference
 * Rewards dominant victories, penalizes narrow wins
 * 
 * delta 10: 1.3 (perfect game)
 * delta 8-9: 1.1 (strong win)
 * delta 3-7: 1.0 (normal game)
 * delta 1-2: 0.9 (narrow win)
 */
export function getScoreMultiplier(scoreDelta: number): number {
  if (scoreDelta === 10) return 1.3;
  if (scoreDelta >= 8) return 1.1;
  if (scoreDelta <= 2) return 0.9;
  return 1.0;
}

/**
 * Calculate rating changes for both teams after a game
 * @param team1 - Ratings of team 1 players
 * @param team2 - Ratings of team 2 players  
 * @param team1Score - Score of team 1
 * @param team2Score - Score of team 2
 * @returns Rating changes with breakdown
 */
export function calculateEloChanges(
  team1: TeamRatings,
  team2: TeamRatings,
  team1Score: number,
  team2Score: number
): EloResult {
  const team1Rating = getTeamRating(team1);
  const team2Rating = getTeamRating(team2);

  // Determine winner and loser
  const team1Wins = team1Score > team2Score;
  const winnerRating = team1Wins ? team1Rating : team2Rating;
  const loserRating = team1Wins ? team2Rating : team1Rating;

  // Calculate base points (bounded 10-100)
  const basePoints = calculateBasePoints(winnerRating, loserRating);

  // Calculate score multiplier (0.9-1.3)
  const scoreDelta = Math.abs(team1Score - team2Score);
  const multiplier = getScoreMultiplier(scoreDelta);

  // Calculate effective points (rounded)
  const pointsEffectifs = Math.round(basePoints * multiplier);

  // Winner gains, loser loses
  const winnerChange = pointsEffectifs;
  const loserChange = -pointsEffectifs;

  return {
    winnerChange,
    loserChange,
    basePoints,
    multiplier,
    pointsEffectifs,
  };
}

/**
 * Apply rating change with floor protection
 * Ensures rating never goes below MIN_ELO (0)
 */
export function applyRatingChange(currentRating: number, change: number): number {
  return Math.max(MIN_ELO, currentRating + change);
}

/**
 * Format rating for display (rounded to nearest integer)
 */
export function formatRating(rating: number): string {
  return Math.round(rating).toString();
}

/**
 * Format rating change for display (with + or - prefix)
 */
export function formatRatingChange(change: number): string {
  const rounded = Math.round(change);
  return rounded >= 0 ? `+${rounded}` : `${rounded}`;
}
