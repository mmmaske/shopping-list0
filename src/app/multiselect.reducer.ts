import { createReducer, on } from '@ngrx/store';
import { multiSelectActions } from './multiselect.actions';

export const initialMultiSelectState: string[] = [
];

export const multiSelectReducer = createReducer(
  initialMultiSelectState,
  on(multiSelectActions.check, (_state, { id }) => [..._state, id]),
  on(multiSelectActions.uncheck, (_state,  id ) =>
    _state.filter((oldid)=>oldid !== id.id)
),
);
