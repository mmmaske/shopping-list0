import { createActionGroup, props } from '@ngrx/store';
import { User } from './models/user';

export const authState = createActionGroup({
  source: 'Auth',
  events: {
    signin: props<{ userdata: User }>(),
    signup: props<{ userdata: User }>(),
    signout: props<{ userdata: User }>(),
  },
});

export const authStateActions = createActionGroup({
  source: 'AuthApi',
  events: {
    retrievedata: props<{ userdata: User }>(),
    login: props<{ userdata: User }>(),
    loginSuccess: props<{ userdata: User }>(),
    loginFailure: props<{ userdata: User }>(),
  },
});
