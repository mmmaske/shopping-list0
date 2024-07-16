import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as DataActions from './data.actions'
import { DataState } from './data.reducer';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private store: Store<DataState>) { }

  addData(id: number, name: string) {
    this.store.dispatch(DataActions.addData({ id, name }));
  }

  removeData(id: number) {
    this.store.dispatch(DataActions.removeData({ id }));
  }
}