import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as authActions from './auth.actions';
import * as msa from './multiselect.actions'
import { Store } from '@ngrx/store';

@Injectable()
export class authEffects {
    login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(authActions.authStateActions.login),
        map(({ userdata: userdata }) => {
          console.log(`User logged in as ${userdata.displayName}`);
          return { type: 'No action needed' }; // No new action needed here, just logging
        }),
      ),
    );

  logout$ = createEffect(() =>
  this.actions$.pipe(
    ofType(authActions.authStateActions.logout),
    map(() => {
        this.store.dispatch(msa.multiSelectActions.clear());
      return { type: 'No action needed' }; // No new action needed here, just logging
    }),
  ),
);

  constructor(
    private actions$: Actions,
    private store:Store,
    ) {}
}
