export interface AlgorithmState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  found: number[];
  current: number[];
  isRunning: boolean;
  isCompleted: boolean;
}

export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export interface SearchingStep {
  array: number[];
  comparing: number[];
  found: number[];
  current: number[];
}

export type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
export type SearchingAlgorithm = 'linear' | 'binary' | 'jump';