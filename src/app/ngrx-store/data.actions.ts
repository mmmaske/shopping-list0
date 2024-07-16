import { createAction, props } from '@ngrx/store';

export const addData = createAction(
  '[Data] Add Data',
  props<{ id: number, name: string }>() // Replace with your data model
);

export const removeData = createAction(
  '[Data] Remove Data',
  props<{ id: number }>()
);