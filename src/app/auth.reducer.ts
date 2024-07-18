import { createReducer, on } from '@ngrx/store';
import { authStateActions } from './auth.actions';
import { User } from './models/user';

export const initialUserState: User = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: false,
};

export const authReducer = createReducer(
  initialUserState,
  on(authStateActions.login, (_state, { userdata }) => userdata),
  on(authStateActions.logout, (_state, {}) => initialUserState),
  // on(authStateActions.loginSuccess,(_state, {token})=>({...state,token,isLoading:false}))
);
