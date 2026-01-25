import { create } from 'zustand';

interface GameFormState {
  team1Player1Id: number | null;
  team1Player2Id: number | null;
  team2Player1Id: number | null;
  team2Player2Id: number | null;
  team1Score: string;
  team2Score: string;

  setTeam1Player1: (id: number | null) => void;
  setTeam1Player2: (id: number | null) => void;
  setTeam2Player1: (id: number | null) => void;
  setTeam2Player2: (id: number | null) => void;
  setTeam1Score: (score: string) => void;
  setTeam2Score: (score: string) => void;
  reset: () => void;
  getSelectedPlayerIds: () => number[];
  isValid: () => boolean;
}

const initialState = {
  team1Player1Id: null,
  team1Player2Id: null,
  team2Player1Id: null,
  team2Player2Id: null,
  team1Score: '',
  team2Score: '',
};

export const useGameFormStore = create<GameFormState>((set, get) => ({
  ...initialState,

  setTeam1Player1: (id) => set({ team1Player1Id: id }),
  setTeam1Player2: (id) => set({ team1Player2Id: id }),
  setTeam2Player1: (id) => set({ team2Player1Id: id }),
  setTeam2Player2: (id) => set({ team2Player2Id: id }),
  setTeam1Score: (score) => set({ team1Score: score }),
  setTeam2Score: (score) => set({ team2Score: score }),

  reset: () => set(initialState),

  getSelectedPlayerIds: () => {
    const state = get();
    return [
      state.team1Player1Id,
      state.team1Player2Id,
      state.team2Player1Id,
      state.team2Player2Id,
    ].filter((id): id is number => id !== null);
  },

  isValid: () => {
    const state = get();
    const { team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id, team1Score, team2Score } = state;

    // All players must be selected
    if (!team1Player1Id || !team1Player2Id || !team2Player1Id || !team2Player2Id) {
      return false;
    }

    // All players must be unique
    const playerIds = [team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id];
    if (new Set(playerIds).size !== 4) {
      return false;
    }

    // Scores must be valid numbers
    const score1 = parseInt(team1Score, 10);
    const score2 = parseInt(team2Score, 10);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      return false;
    }

    // Scores must be different (no ties)
    if (score1 === score2) {
      return false;
    }

    return true;
  },
}));
