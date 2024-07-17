import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './models/appstate.model';
import * as UserActions from './user.actions';

const _userReducer = createReducer(
  initialUserState,
  on(UserActions.login, (state, { userName }) => ({
    ...state,
    userName,
    isLoggedIn: true,
  })),
  on(UserActions.logout, () => initialUserState),
);

export function userReducer(state: any, action: any) {
  console.log(state);
  return _userReducer(state, action);
}
