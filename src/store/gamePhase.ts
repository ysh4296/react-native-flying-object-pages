import { registry } from '@engine/lib/main';
import { create } from 'zustand';

type GamePhaseStoreType = {
  gamePhase: GamePhase;
  setGamePhase: (gamePhase: GamePhase) => void;
};

const useGamePhaseStore = create<GamePhaseStoreType>((set) => ({
  gamePhase: 'pause',
  setGamePhase: (gamePhase: GamePhase) => {
    /** state used in canvas */
    registry.gamePhase = gamePhase;

    /** state used for react app */
    set({ gamePhase: gamePhase });
  },
}));

export default useGamePhaseStore;
