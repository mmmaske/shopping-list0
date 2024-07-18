import { createSelector, createFeatureSelector } from '@ngrx/store';

const selectMultiState = createFeatureSelector<string[]>('multiSelect');

export const selectAll = createSelector(
  selectMultiState,
  (state: string[]) => state,
);
export const selectCount = createSelector(
  selectMultiState,
  (state: string[]) => state.length,
);
