import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';
import { debug } from '../utils/common';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ItemService } from '../services/items.service';
import { ListContainerFormComponent } from '../components/list-container-form/list-container-form.component';
import { ContainersService } from '../services/containers.service';
import * as msa from '../multiselect.actions';
import { Store, select } from '@ngrx/store';
import {
  multiSelectState,
  selectAllChecked,
  selectCountChecked,
} from '../multiselect.selector';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  loggedin: boolean = this.authServ.isLoggedIn;
  title = 'Shopping List';
  itemCount$: Observable<number>;
  isMultiSelect$: Observable<boolean>;
  items$: Observable<string[]>;

  imsorry: string = `i̸͇͚̐͛̆̕̚'̸̡̢̡̯͈̯̹͖̭̠͚̥͈͍̖̝̬̹͓̝͚̣̪̝̟̍̅̏̋̍̅̈́̃̀͑̾̿́̌̅̅͐͐͗̃́̋͛̿͑̅̒̑̐͑̀̽̊́̄͊͛̇͘̚̚͜͝͝͝ͅͅm̴̬͔̝̦̝̱̪͇̲̮͍̗̻̼̩̹̗͇̑͋͛͂̅̈́̆̈́̽̿̈̂͊̎͐̐̀̆͛͐̂̅̑̍̆͛͑̕͝͠͝ ̴̨̛̦̗̻͉͚̩̰̤̰̲͚̬͓̳̗͓̖͙̩͈̼̼̬̫̖͚̅̏̅͆̌͑̋̀̄̀̀̈́͗͋͌̊̉͘͝ͅs̷̨̛͙͔̜̘͈̜̞̠̖̬̤͕͕̪̈̐̆͊̏̄̌̑̈͑͂̃̏̌̅̏͊̾̃̋͂̿̄̑͂͐́̒̓̊̕̚̚̚͘͘͘͘͜͠͠͝͝ͅo̷͍̖͈̳͖̰̬̍͐̈́̂̽̿̂̓̃͂͂̄̆̾̏̔̏͐̊͊̓͆̕͠r̷̢̤̜̦͔̜̙̜͎̭̘̫̭̩̮̝̘̯̫̼̖̦̬̺̮̻̔́͌̿̅̉̀̒̀̚͝͠ͅr̶͍̙̫̗͍̱̠̼̗̮͎̠͍̲͙̘̭͠ͅy̸̧̨̡̨̧̧̢̛̛̫͔̞̪̦̼̝͎͙͈̭̜̼̞̮̰̥̫̟̹̩̗̝̹̙̩̥̼̙̑̑̓͛̇̒̂̽͐́̈́̽̑̔͛̌̈́̔̓̅͒̚̚͘͝͠ͅ`;

  dontgo: string = `
    Ḑ̸̧̢̡̡̧̧̧̛̩͙̖̪͉̭͇̙̯̤̟͉̜̠̦̫̗̩̗̯̮̙̮̬̘̥̪͎̯̥̝̳̮̳̼̰̼̝̬͈̫̟͖̤̥̼͇̭̞͕̟͍̣̬͔̪̞̦̘̝̳̬̦͓̟͓͕̖̜̫̜̟̥̫͇̟̱̜̪̲̩̣̪͎̹͙̣̺̣̳̤̣͚̪͕̖̪͚͔͓̝̎̉͊̆͂̂̏͊̇̌͆̂̄͆̄͂͒̾͑́̽̎̍̄̅̂̒̆̅͂̃̃̆͌̃͒̈́͆͐̄̔͆̀͊̅̈́̈̀̽̄̍͋̄̍͑̍́̽͐͑̿͋̚̚͜͜͜͝ͅͅͅÖ̷̧̧̡̡̨̨̨̢̨̧̬͍̯͖̩̠̭̣̰̖͉̼͙̞̘̠̬̤̼̩̱̰̗͙͎̰̤̖̦͕̫͇̠͈̝͈͙͙̦̝̳͔̪͖͎̗͉̘̙̜̼̲̭̼̬̜̯̯̤̺̝̬̘͓̣̝̺̜̫̯̘̘͔̖̥̳͖̝͔̜̤͎͎̰̭͓́̅̂̽̃̆̃̋͌͌̑̏̑̀̓̐̈́̅̀̈̀̆͆̓̇̊͐̕͘͘͜͜͝ͅͅŅ̵̧̢̨̨̧̡̧̧̛̛̛̞͔̠̭̣̻̥̣͎͍͍̬̻̖̤̗̖̼̺̗̣̫̼̤͖͎̪͕̺͍̙̯̬͕̤̠̝̣̤̖̜͇͇̗͎̼̲̖̮͎̳̻̝̟̙̱̫̙̦̺͚̝̳͉͍̤̫̲̯̤͈̖̮̺̟̮͕͍̲̖͚̤͔̭͇͓̩̭͚̥͕̭̯͙̯̦͇͙͉̳̪̱̭̥́̊̾̂̿̆̒̅̒̐̓̓͛͊̈̓̃͊̏͋͛̓̌̌̃̏͐̈̀͆̆̉̾̃̍̎́̊̎̋̅̃̐̏̌̈́̎̀́̋́͋̈́̓̎̋͒͋̌̓̓͛͋̈́̒̋͋̒̑̈́́̔̈́̽͛̇̓͊̐͐͌̾̊̌̆̔̔̂͒̌͗̕͘̚͘̚̕̚̕̕͜͜͜͝͝͠͝͝͝ͅͅ'̷̢̨̨̨̧̨̨̢̡̛͖̟̝̯̻̠̞̤͇̣̝͙̟̠̞̥̩̭̖͓̱̬̞͔̠͍̣͇̘̩̙̰̯͖͇͎̘̗͕͇͇̣̤̩̼͔͖̙̤͚̥̯̥̙͕͕̫̘̻̯̙͕̘̗͕̠̼̺̮͚̺̳͎̥̘̞͉͕͇͓̟̘̭̼̻͕̮̼͓̟̻̘͖͓͍͕͖̩̰͓͂̊̄̇̾́̽̈́͋͒̄̄̋̃͒̿̀̿̍̈́͌͑͑́̓̑̊͋͗̊͒̓̆̆͐͆̀̒̈́̚͘͘͜͜͠͠͝͝͝ͅT̵̡̨̧̧̛̛̪̮̳̖͈̗̙̹͔̣͔̮̯̱͙͖̲̼̭̖͕̺̪̐̅̈́̍͛̏̾̋͒̋̋͐́́͐̏͛̽̒̎̽̀́̾̔̑̓̓̔̑̇̐͊̓̆̄̈́͋̓̏͗̽͋̈́̿͛̎̓̂̂̐͌̐̈̎͋̄̌͛͑̍̓́̋̓̿̋̀̇̿̄̔̑͋̈͋́̊͑̂̅̿̿̑̏̈̀̈́̅̓̎̌̆͊͌̄͒͗̆̈̉͆̌͊̚̕͘̕͝͝͠͠͝͠͝͝͝͝͠͠ͅ ̴̡̬͇̙̫̙̲̳͈̮̩̬͈͍͕̩̥̟͓̩̇̾̾̋͑́͌̃̓̉̀͒̓͂́̑̋̕̚͜͜͜ͅͅḠ̷̢̧̨̨̢̨̛̛̛̣̪̟̼̠͔̺̯̣̰̤͉͉̭̗̙̻͉͈͚̻͎̘̗̰̼̞̥͈̟̩̺̱͎͈̺͔̳̪̊͂̈̆̂̓̔̆͐́͗͗͛͌̍͂͂̂̒́̂̅̒̔͆͌̋̋̊̿͐̉̽͂́͑̊̀̓̓̈̏̄̓́̓͗͌̏̒͛̃̒̆̀̒̀́̑̐̓̄͑̏̂̊̇̊̅͋͐̅͑͘̚͘͘̚͘̕̕̕͘͜͝͝͝͝͝Ơ̸̡̻̫͖̦̳̝̜͓̣̜̺̯̼̬̦̱̠̘̠͓͈̖̪̫̜̮̤̖̞̌̇͛̏̃́̉̔̉̉̎͌̎̄͊̈́̓͂̾̈́͛̈́͊͂́̇̀̌̊̓̀͆͐̇̅̔̀͛̆̇̋̆̈́͑̈́̈̽̈́̽̌̈̈͊̍̋͒̀͊̃̓̂̔̅͂̋̆̽̔͐̈́͒̏̓͘͜͠͝͝͝͝͝ͅͅͅ
    `;

  constructor(
    public authServ: AuthService,
    private router: Router,
    public item: ItemService,
    public container: ContainersService,
    private store: Store,
  ) {
    this.itemCount$ = this.store.select(selectCountChecked);
    this.items$ = this.store.select(selectAllChecked);
    this.isMultiSelect$ = this.store.pipe(select(multiSelectState));
  }
  public name: string = '';
  readonly dialog = inject(MatDialog);

  handleSignOut(): void {
    this.authServ.SignOut().then((returned) => {
      Swal.fire({
        title: `Why are you leaving?`,
        html: `Where are you going? How will you remember what to get there? <h2>🥺</h2> <h3>${this.imsorry}</h3><h1>${this.dontgo}</h1>`,
        icon: 'success',
        confirmButtonText: 'K',
      });
      this.router.navigate(['']);
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.name = result;
      }
    });
  }

  openAddContainerDialog(): void {
    const dialogRef = this.dialog.open(ListContainerFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.name = result;
      }
    });
  }

  toggleSelectMultiple(): void {
    this.item.selectedItems = [];
    this.store.dispatch(msa.multiSelectActions.toggle());
    this.item.selectMultiple = !this.item.selectMultiple;
  }

  handleDeleteSelected(): void {
    const sub = this.items$.subscribe((items) => {
      if (items.length > 0) {
        Swal.fire({
          title: 'Are you sure?',
          text: `You're going to be deleting ${items.length} items and they can't be recovered.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        })
          .then((result) => {
            if (result.isConfirmed) {
              const delete$ = this.item.deleteSelected(items).subscribe(
                () => {
                  Swal.fire({
                    title: `${items.length} items deleted!`,
                    icon: 'success',
                    confirmButtonText:
                      'Thank you for deleting those items, shopping list website!',
                  });
                  this.item.selectMultiple = false;
                  items = [];
                },
                (error) => {
                  Swal.fire({
                    title: `Unable to delete ${items.length} items!`,
                    text: error,
                    icon: 'error',
                    confirmButtonText:
                      "I'm sorry, I'll try to do better next time",
                  });
                  this.item.selectMultiple = false;
                  items = [];
                },
              );
            }
          })
          .finally(() => {
            sub.unsubscribe();
          });
      }
    });
  }

  handlePurchaseSelected(): void {
    const sub = this.items$.subscribe((items) => {
      if (items.length > 0) {
        Swal.fire({
          title: `Mark ${items.length} items as purchased?`,
          text: `You're going mark ${items.length} items as purchased. This action can be reversed.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, purchase these items!',
        })
          .then((result) => {
            if (result.isConfirmed) {
              const swipeTogglePurchased$ = this.item
                .purchaseSelected(items)
                .subscribe(
                  () => {
                    Swal.fire({
                      title: `${items.length} items purchased!`,
                      icon: 'success',
                      confirmButtonText:
                        'Thank you for purchasing those items, shopping list website!',
                    });
                    this.item.selectMultiple = false;
                    items = [];
                  },
                  (error) => {
                    Swal.fire({
                      title: `Unable to purchase ${items.length} items!`,
                      text: error,
                      icon: 'error',
                      confirmButtonText:
                        "I'm sorry, I'll try to do better next time",
                    });
                    this.item.selectMultiple = false;
                    items = [];
                  },
                );
            }
          })
          .finally(() => {
            sub.unsubscribe();
          });
      }
    });
  }
}
