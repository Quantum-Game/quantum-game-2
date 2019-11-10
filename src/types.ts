import Cell from '@/engine/Cell';
import Particle from '@/engine/Particle';
import Level from '@/engine/Level';

export interface RootState {
  activeCell: Cell;
  hoveredCell: Cell;
  hoveredParticles: [Particle];
  cellSelected: boolean;
  gameState: string;
  simulationState: boolean;
  currentLevelID: number;
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
  savedLevelsList: SavedLevel[];
  publicLevels: PublicLevel[];
  error: null;
}
interface ProgressObj {
  id: number;
  status: 'string';
  score: number;
}
interface SavedLevel {
  id: 'string';
  link: 'string';
  public: boolean;
}
interface PublicLevel {
  link: 'string';
}
