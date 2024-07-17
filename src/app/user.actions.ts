import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[User Component] Login',
  props<{ userName: string }>(),
);
export const logout = createAction('[User Component] Logout');
