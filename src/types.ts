import Cell from '@/engine/Cell';
import Level from '@/engine/Level';

export interface RootState {
  activeCell: Cell;
  hoveredCell: Cell;
  cellSelected: boolean;
  gameState: string;
  simulationState: boolean;
  currentLevelID: number;
}
