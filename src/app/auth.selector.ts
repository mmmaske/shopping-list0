import { createSelector, createFeatureSelector } from '@ngrx/store';
import { User } from './models/user';

const selectAuthState = createFeatureSelector<User>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: User) => state,
);
