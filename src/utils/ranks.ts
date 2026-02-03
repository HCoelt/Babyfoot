// Rank tiers derived from Elo rating (never stored, always calculated)

export type Rank = 'Iron' | 'Bronze' | 'Gold' | 'Diamond' | 'Master' | 'Challenger';

export interface RankInfo {
    name: Rank;
    minElo: number;
    maxElo: number;
    color: string;
    image: any;
}

// Import rank images
const rankImages = {
    iron: require('../../assets/images/ranks/iron.png'),
    bronze: require('../../assets/images/ranks/bronze.png'),
    gold: require('../../assets/images/ranks/gold.png'),
    diamond: require('../../assets/images/ranks/diamond.png'),
    master: require('../../assets/images/ranks/master.png'),
    challenger: require('../../assets/images/ranks/challenger.png'),
};

export const RANK_TIERS: RankInfo[] = [
    {
        name: 'Iron',
        minElo: 0,
        maxElo: 399,
        color: '#7B7B7B',
        image: rankImages.iron,
    },
    {
        name: 'Bronze',
        minElo: 400,
        maxElo: 799,
        color: '#CD7F32',
        image: rankImages.bronze,
    },
    {
        name: 'Gold',
        minElo: 800,
        maxElo: 1199,
        color: '#FFD700',
        image: rankImages.gold,
    },
    {
        name: 'Diamond',
        minElo: 1200,
        maxElo: 1599,
        color: '#B9F2FF',
        image: rankImages.diamond,
    },
    {
        name: 'Master',
        minElo: 1600,
        maxElo: 1999,
        color: '#9B59B6',
        image: rankImages.master,
    },
    {
        name: 'Challenger',
        minElo: 2000,
        maxElo: Infinity,
        color: '#E74C3C',
        image: rankImages.challenger,
    },
];

/**
 * Get the rank for a given Elo rating
 * Ranks are view-only and never stored in the database
 */
export function getRankFromElo(elo: number): Rank {
    if (elo < 400) return 'Iron';
    if (elo < 800) return 'Bronze';
    if (elo < 1200) return 'Gold';
    if (elo < 1600) return 'Diamond';
    if (elo < 2000) return 'Master';
    return 'Challenger';
}

/**
 * Get the full rank info for a given Elo rating
 */
export function getRankInfo(elo: number): RankInfo {
    const rank = getRankFromElo(elo);
    return RANK_TIERS.find(tier => tier.name === rank)!;
}

/**
 * Get progress percentage within current rank tier
 */
export function getRankProgress(elo: number): number {
    const rankInfo = getRankInfo(elo);
    if (rankInfo.maxElo === Infinity) return 100;

    const range = rankInfo.maxElo - rankInfo.minElo + 1;
    const progress = elo - rankInfo.minElo;
    return Math.min(100, Math.max(0, (progress / range) * 100));
}
