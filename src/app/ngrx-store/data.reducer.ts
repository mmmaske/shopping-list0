import { createReducer, on } from '@ngrx/store';
import * as DataActions from './data.actions';

export interface DataState {
  entities: { [id: number]: { id: number; name: string } }; // Replace with your data model
}

export const initialState: DataState = {
  entities: {},
};

export const dataReducer = createReducer(
  initialState,

  on(DataActions.addData, (state, { id, name }) => ({
    ...state,
    entities: {
      ...state.entities,
      [id]: { id, name },
    },
  })),

  on(DataActions.removeData, (state, { id }) => {
    const { [id]: removed, ...entities } = state.entities;
    return { ...state, entities };
  }),
);
