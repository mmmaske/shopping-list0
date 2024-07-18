import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './models/user';

export const authStateActions = createActionGroup({
  source: 'AuthApi',
  events: {
    retrievedata: props<{ userdata: User }>(),
    login: props<{ userdata: User }>(),
    loginSuccess: props<{ userdata: User }>(),
    loginFailure: props<{ userdata: User }>(),
    logout: emptyProps(),
  },
});
