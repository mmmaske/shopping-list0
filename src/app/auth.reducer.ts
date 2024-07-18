import { createReducer, on } from '@ngrx/store';
import { authStateActions } from './auth.actions';
import { User } from './models/user';
import { map } from 'rxjs';
import { state } from '@angular/animations';

export const initialState: User = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: false,
};

export const authReducer = createReducer(
  initialState,
  on(authStateActions.login, (_state, { userdata }) => userdata),
  on(authStateActions.logout, (_state, {}) => initialState),
  // on(authStateActions.loginSuccess,(_state, {token})=>({...state,token,isLoading:false}))
);
