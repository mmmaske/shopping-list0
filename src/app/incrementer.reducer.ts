import { createReducer, on } from '@ngrx/store';
import { initialCounterState } from './models/appstate.model';
import * as CounterActions from './incrementer.actions';

const _counterReducer = createReducer(
  initialCounterState,
  on(CounterActions.increment, (state, { timestamp }) => ({
    ...state,
    count: state.count + 1,
    incrementTimes: [...state.incrementTimes, timestamp],
  })),
  on(CounterActions.decrement, (state) => ({
    ...state,
    count: state.count - 1,
  })),
  on(CounterActions.reset, () => initialCounterState),
);

export function counterReducer(state: any, action: any) {
  return _counterReducer(state, action);
}
