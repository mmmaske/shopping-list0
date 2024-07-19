import { createSelector, createFeatureSelector } from '@ngrx/store';

const selectMultiState = createFeatureSelector<{
  isMultiSelect: boolean;
  multiSelected: [];
}>('multiSelect');

export const multiSelectState = createSelector(
  selectMultiState,
  (state: { isMultiSelect: boolean; multiSelected: [] }) => state.isMultiSelect,
);
export const selectAllChecked = createSelector(
  selectMultiState,
  (state: { isMultiSelect: boolean; multiSelected: [] }) => state.multiSelected,
);
export const selectCountChecked = createSelector(
  selectMultiState,
  (state: { isMultiSelect: boolean; multiSelected: [] }) =>
    state.multiSelected.length,
);
