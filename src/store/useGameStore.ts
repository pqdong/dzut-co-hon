import { create } from 'zustand';

export type GameState = 'intro' | 'playing' | 'mission' | 'result';

export type GhostTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface CaughtGhost {
  id: string;
  tier: GhostTier;
}

export interface Reward {
  type: 'coupon' | 'item' | 'points';
  name: string;
  value?: number;
}

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  
  soundSettings: {
    sound: boolean;
    vibration: boolean;
  };
  toggleSound: () => void;
  toggleVibration: () => void;
  
  userTurns: number;
  setUserTurns: (turns: number | ((prev: number) => number)) => void;
  addTurns: (turns: number) => void;
  
  caughtGhost: CaughtGhost | null;
  reward: Reward | null;
  setCaughtResult: (ghost: CaughtGhost, reward: Reward) => void;
  
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'intro',
  setGameState: (state) => set({ gameState: state }),
  
  soundSettings: {
    sound: true,
    vibration: true,
  },
  toggleSound: () => set((state) => ({ soundSettings: { ...state.soundSettings, sound: !state.soundSettings.sound } })),
  toggleVibration: () => set((state) => ({ soundSettings: { ...state.soundSettings, vibration: !state.soundSettings.vibration } })),
  
  userTurns: 3, // Start with some mock turns
  setUserTurns: (turns) => set((state) => ({ userTurns: typeof turns === 'function' ? turns(state.userTurns) : turns })),
  addTurns: (amount) => set((state) => ({ userTurns: state.userTurns + amount })),
  
  caughtGhost: null,
  reward: null,
  setCaughtResult: (caughtGhost, reward) => set({ caughtGhost, reward }),
  
  sessionToken: null,
  setSessionToken: (sessionToken) => set({ sessionToken }),
}));
