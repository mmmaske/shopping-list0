import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as authActions from './auth.actions';
import * as msa from './multiselect.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class multiSelectEffects {
  toggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(msa.multiSelectActions.toggle),
      map(() => {
        this.store.dispatch(msa.multiSelectActions.clear());
        return { type: '[MultiSelect - Toggle effect] dispatch clear' };
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}
}
