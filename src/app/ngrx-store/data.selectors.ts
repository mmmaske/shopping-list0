import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DataState } from './data.reducer';

export const selectDataState = createFeatureSelector<DataState>('data');

export const selectAllData = createSelector(
  selectDataState,
  (state: DataState) => Object.values(state.entities),
);

export const selectDataById = (id: number) =>
  createSelector(selectDataState, (state: DataState) => state.entities[id]);
