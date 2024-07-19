import { createReducer, on } from '@ngrx/store';
import { multiSelectActions } from './multiselect.actions';

export const initialMultiSelectState: {
  isMultiSelect: boolean;
  multiSelected: string[];
} = {
  isMultiSelect: false,
  multiSelected: [],
};

export const multiSelectReducer = createReducer(
  initialMultiSelectState,
  on(multiSelectActions.check, (_state, { id }) => ({
    isMultiSelect: _state.isMultiSelect,
    multiSelected: [..._state.multiSelected, id],
  })),

  on(multiSelectActions.uncheck, (_state, id) => ({
    isMultiSelect: _state.isMultiSelect,
    multiSelected: _state.multiSelected.filter((oldid) => oldid !== id.id),
  })),

  on(multiSelectActions.clear, (_state) => ({
    isMultiSelect: _state.isMultiSelect,
    multiSelected: [],
  })),

  on(multiSelectActions.reset, (_state) => initialMultiSelectState),

  on(multiSelectActions.toggle, (_state) => ({
    isMultiSelect: !_state.isMultiSelect,
    multiSelected: [..._state.multiSelected],
  })),
);
