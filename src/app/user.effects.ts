import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  // Example effect to handle login action
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      map(({ userName }) => {
        // Perform side effects like storing to local storage, etc.
        console.log(`User logged in as ${userName}`);
        return { type: 'No action needed' }; // No new action needed here, just logging
      }),
    ),
  );

  constructor(private actions$: Actions) {}
}
