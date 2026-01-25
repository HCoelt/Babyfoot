// Modified Elo rating system for 2v2 team games

const K_FACTOR = 32; // Sensitivity of rating changes

interface TeamRatings {
  player1Rating: number;
  player2Rating: number;
}

interface EloResult {
  team1Change: number;
  team2Change: number;
}

/**
 * Calculate the average rating of a team
 */
export function getTeamRating(team: TeamRatings): number {
  return (team.player1Rating + team.player2Rating) / 2;
}

/**
 * Calculate expected score (probability of winning) for team1
 * Uses the standard Elo formula: E = 1 / (1 + 10^((R2 - R1) / 400))
 */
export function calculateExpectedScore(team1Rating: number, team2Rating: number): number {
  return 1 / (1 + Math.pow(10, (team2Rating - team1Rating) / 400));
}

/**
 * Calculate rating changes for both teams after a game
 * @param team1 - Ratings of team 1 players
 * @param team2 - Ratings of team 2 players
 * @param winnerTeam - 1 if team1 won, 2 if team2 won
 * @returns Rating changes for each team (positive for winner, negative for loser)
 */
export function calculateEloChanges(
  team1: TeamRatings,
  team2: TeamRatings,
  winnerTeam: 1 | 2
): EloResult {
  const team1Rating = getTeamRating(team1);
  const team2Rating = getTeamRating(team2);

  const team1Expected = calculateExpectedScore(team1Rating, team2Rating);

  // Actual scores: 1 for win, 0 for loss
  const team1Actual = winnerTeam === 1 ? 1 : 0;

  // Calculate rating change
  const team1Change = Math.round(K_FACTOR * (team1Actual - team1Expected));
  const team2Change = -team1Change; // Zero-sum: one team's gain is the other's loss

  return {
    team1Change,
    team2Change,
  };
}

/**
 * Calculate new rating after applying a change
 */
export function applyRatingChange(currentRating: number, change: number): number {
  // Ensure rating doesn't go below 100
  return Math.max(100, currentRating + change);
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
