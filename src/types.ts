import Cell from '@/engine/Cell';
import Level from '@/engine/Level';

export interface RootState {
  level: Level;
  activeCell: Cell;
  hoveredCell: Cell;
  cellSelected: boolean;
  gameState: string;
  simulationState: boolean;
}

export interface UserState {
  user: {
    loggedIn: boolean;
    rememberMe: boolean;
    data: {
      displayName: string;
      email: string;
    };
  };
  progressArr: ProgressObj[];
  error: null;
}
interface ProgressObj {
  id: number;
  status: 'string';
  score: number;
}
