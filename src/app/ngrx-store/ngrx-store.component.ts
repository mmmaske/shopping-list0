import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataState } from './data.reducer';
import { DataService } from './data.service';
import { selectAllData } from './data.selectors';

@Component({
  selector: 'app-ngrx-store',
  templateUrl: './ngrx-store.component.html',
  styleUrls: ['./ngrx-store.component.css'],
})
export class NgrxStoreComponent {
  data$: Observable<any[]>; // Replace with your data model

  constructor(
    private store: Store<DataState>,
    private dataService: DataService,
  ) {
    this.data$ = this.store.select(selectAllData);
  }

  addData(id: number, name: string) {
    this.dataService.addData(id, name);
  }

  removeData(id: number) {
    this.dataService.removeData(id);
  }

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  clickAddDataHandler() {
    const obj = {
      id: Math.random(),
      name: this.generateRandomString(20),
    };
    this.addData(obj.id, obj.name);
  }
}
