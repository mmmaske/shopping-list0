import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate.model';
import { increment, decrement, reset } from '../incrementer.actions';
import { login, logout } from '../user.actions';

@Component({
  selector: 'app-ngrx-store',
  templateUrl: './ngrx-store.component.html',
  styleUrls: ['./ngrx-store.component.css'],
})
export class NgrxStoreComponent {
  counter$ = this.store.select((state) => state.counter.count);
  userName$ = this.store.select((state) => state.user.userName);
  isLoggedIn$ = this.store.select((state) => state.user.isLoggedIn);

  constructor(private store: Store<AppState>) {}

  increment() {
    const now = new Date().toISOString();
    this.store.dispatch(increment({timestamp:now}));
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }

  login(userName: string) {
    this.store.dispatch(login({ userName }));
  }

  logout() {
    this.store.dispatch(logout());
  }
}
