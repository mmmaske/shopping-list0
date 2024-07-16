import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';
import { debug } from '../utils/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ItemService } from '../services/items.service';
import { ListContainerFormComponent } from '../components/list-container-form/list-container-form.component';
import { ContainersService } from '../services/containers.service';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataState } from '../ngrx-store/data.reducer'
import { DataService } from '../ngrx-store/data.service';
import { selectAllData } from '../ngrx-store/data.selectors';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  loggedin: boolean = this.authServ.isLoggedIn;
  title = 'Shopping List';

  imsorry: string = `i̸͇͚̐͛̆̕̚'̸̡̢̡̯͈̯̹͖̭̠͚̥͈͍̖̝̬̹͓̝͚̣̪̝̟̍̅̏̋̍̅̈́̃̀͑̾̿́̌̅̅͐͐͗̃́̋͛̿͑̅̒̑̐͑̀̽̊́̄͊͛̇͘̚̚͜͝͝͝ͅͅm̴̬͔̝̦̝̱̪͇̲̮͍̗̻̼̩̹̗͇̑͋͛͂̅̈́̆̈́̽̿̈̂͊̎͐̐̀̆͛͐̂̅̑̍̆͛͑̕͝͠͝ ̴̨̛̦̗̻͉͚̩̰̤̰̲͚̬͓̳̗͓̖͙̩͈̼̼̬̫̖͚̅̏̅͆̌͑̋̀̄̀̀̈́͗͋͌̊̉͘͝ͅs̷̨̛͙͔̜̘͈̜̞̠̖̬̤͕͕̪̈̐̆͊̏̄̌̑̈͑͂̃̏̌̅̏͊̾̃̋͂̿̄̑͂͐́̒̓̊̕̚̚̚͘͘͘͘͜͠͠͝͝ͅo̷͍̖͈̳͖̰̬̍͐̈́̂̽̿̂̓̃͂͂̄̆̾̏̔̏͐̊͊̓͆̕͠r̷̢̤̜̦͔̜̙̜͎̭̘̫̭̩̮̝̘̯̫̼̖̦̬̺̮̻̔́͌̿̅̉̀̒̀̚͝͠ͅr̶͍̙̫̗͍̱̠̼̗̮͎̠͍̲͙̘̭͠ͅy̸̧̨̡̨̧̧̢̛̛̫͔̞̪̦̼̝͎͙͈̭̜̼̞̮̰̥̫̟̹̩̗̝̹̙̩̥̼̙̑̑̓͛̇̒̂̽͐́̈́̽̑̔͛̌̈́̔̓̅͒̚̚͘͝͠ͅ`;

  dontgo: string = `
    Ḑ̸̧̢̡̡̧̧̧̛̩͙̖̪͉̭͇̙̯̤̟͉̜̠̦̫̗̩̗̯̮̙̮̬̘̥̪͎̯̥̝̳̮̳̼̰̼̝̬͈̫̟͖̤̥̼͇̭̞͕̟͍̣̬͔̪̞̦̘̝̳̬̦͓̟͓͕̖̜̫̜̟̥̫͇̟̱̜̪̲̩̣̪͎̹͙̣̺̣̳̤̣͚̪͕̖̪͚͔͓̝̎̉͊̆͂̂̏͊̇̌͆̂̄͆̄͂͒̾͑́̽̎̍̄̅̂̒̆̅͂̃̃̆͌̃͒̈́͆͐̄̔͆̀͊̅̈́̈̀̽̄̍͋̄̍͑̍́̽͐͑̿͋̚̚͜͜͜͝ͅͅͅÖ̷̧̧̡̡̨̨̨̢̨̧̬͍̯͖̩̠̭̣̰̖͉̼͙̞̘̠̬̤̼̩̱̰̗͙͎̰̤̖̦͕̫͇̠͈̝͈͙͙̦̝̳͔̪͖͎̗͉̘̙̜̼̲̭̼̬̜̯̯̤̺̝̬̘͓̣̝̺̜̫̯̘̘͔̖̥̳͖̝͔̜̤͎͎̰̭͓́̅̂̽̃̆̃̋͌͌̑̏̑̀̓̐̈́̅̀̈̀̆͆̓̇̊͐̕͘͘͜͜͝ͅͅŅ̵̧̢̨̨̧̡̧̧̛̛̛̞͔̠̭̣̻̥̣͎͍͍̬̻̖̤̗̖̼̺̗̣̫̼̤͖͎̪͕̺͍̙̯̬͕̤̠̝̣̤̖̜͇͇̗͎̼̲̖̮͎̳̻̝̟̙̱̫̙̦̺͚̝̳͉͍̤̫̲̯̤͈̖̮̺̟̮͕͍̲̖͚̤͔̭͇͓̩̭͚̥͕̭̯͙̯̦͇͙͉̳̪̱̭̥́̊̾̂̿̆̒̅̒̐̓̓͛͊̈̓̃͊̏͋͛̓̌̌̃̏͐̈̀͆̆̉̾̃̍̎́̊̎̋̅̃̐̏̌̈́̎̀́̋́͋̈́̓̎̋͒͋̌̓̓͛͋̈́̒̋͋̒̑̈́́̔̈́̽͛̇̓͊̐͐͌̾̊̌̆̔̔̂͒̌͗̕͘̚͘̚̕̚̕̕͜͜͜͝͝͠͝͝͝ͅͅ'̷̢̨̨̨̧̨̨̢̡̛͖̟̝̯̻̠̞̤͇̣̝͙̟̠̞̥̩̭̖͓̱̬̞͔̠͍̣͇̘̩̙̰̯͖͇͎̘̗͕͇͇̣̤̩̼͔͖̙̤͚̥̯̥̙͕͕̫̘̻̯̙͕̘̗͕̠̼̺̮͚̺̳͎̥̘̞͉͕͇͓̟̘̭̼̻͕̮̼͓̟̻̘͖͓͍͕͖̩̰͓͂̊̄̇̾́̽̈́͋͒̄̄̋̃͒̿̀̿̍̈́͌͑͑́̓̑̊͋͗̊͒̓̆̆͐͆̀̒̈́̚͘͘͜͜͠͠͝͝͝ͅT̵̡̨̧̧̛̛̪̮̳̖͈̗̙̹͔̣͔̮̯̱͙͖̲̼̭̖͕̺̪̐̅̈́̍͛̏̾̋͒̋̋͐́́͐̏͛̽̒̎̽̀́̾̔̑̓̓̔̑̇̐͊̓̆̄̈́͋̓̏͗̽͋̈́̿͛̎̓̂̂̐͌̐̈̎͋̄̌͛͑̍̓́̋̓̿̋̀̇̿̄̔̑͋̈͋́̊͑̂̅̿̿̑̏̈̀̈́̅̓̎̌̆͊͌̄͒͗̆̈̉͆̌͊̚̕͘̕͝͝͠͠͝͠͝͝͝͝͠͠ͅ ̴̡̬͇̙̫̙̲̳͈̮̩̬͈͍͕̩̥̟͓̩̇̾̾̋͑́͌̃̓̉̀͒̓͂́̑̋̕̚͜͜͜ͅͅḠ̷̢̧̨̨̢̨̛̛̛̣̪̟̼̠͔̺̯̣̰̤͉͉̭̗̙̻͉͈͚̻͎̘̗̰̼̞̥͈̟̩̺̱͎͈̺͔̳̪̊͂̈̆̂̓̔̆͐́͗͗͛͌̍͂͂̂̒́̂̅̒̔͆͌̋̋̊̿͐̉̽͂́͑̊̀̓̓̈̏̄̓́̓͗͌̏̒͛̃̒̆̀̒̀́̑̐̓̄͑̏̂̊̇̊̅͋͐̅͑͘̚͘͘̚͘̕̕̕͘͜͝͝͝͝͝Ơ̸̡̻̫͖̦̳̝̜͓̣̜̺̯̼̬̦̱̠̘̠͓͈̖̪̫̜̮̤̖̞̌̇͛̏̃́̉̔̉̉̎͌̎̄͊̈́̓͂̾̈́͛̈́͊͂́̇̀̌̊̓̀͆͐̇̅̔̀͛̆̇̋̆̈́͑̈́̈̽̈́̽̌̈̈͊̍̋͒̀͊̃̓̂̔̅͂̋̆̽̔͐̈́͒̏̓͘͜͠͝͝͝͝͝ͅͅͅ
    `;

  constructor(
    public authServ: AuthService,
    private router: Router,
    public item: ItemService,
    public container: ContainersService,
    private dataService: DataService,
  ) {}
  public name: string = '';
  readonly dialog = inject(MatDialog);

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
  addData(id: number, name: string) {
    this.dataService.addData(id, name);
  }
  addToRandomDataState() {
    const obj = {
        id: Math.random(),
        name: this.generateRandomString(20),
      };
      this.addData(obj.id, obj.name);
  }

  handleSignOut(): void {
    this.authServ.SignOut().then((returned) => {
      debug(returned);
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
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.name = result;
      }
    });
  }

  openAddContainerDialog(): void {
    const dialogRef = this.dialog.open(ListContainerFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.name = result;
      }
    });
  }

  toggleSelectMultiple(): void {
    this.item.selectedItems = [];
    this.item.selectMultiple = !this.item.selectMultiple;
  }

  handleDeleteSelected(): void {
    if (this.item.selectedItems.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You're going to be deleting ${this.item.selectedItems.length} items and they can't be recovered.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          const delete$ = this.item
            .deleteSelected(this.item.selectedItems)
            .subscribe(
              () => {
                Swal.fire({
                  title: `${this.item.selectedItems.length} items deleted!`,
                  icon: 'success',
                  confirmButtonText:
                    'Thank you for deleting those items, shopping list website!',
                });
                this.item.selectMultiple = false;
                this.item.selectedItems = [];
              },
              (error) => {
                Swal.fire({
                  title: `Unable to delete ${this.item.selectedItems.length} items!`,
                  text: error,
                  icon: 'error',
                  confirmButtonText:
                    "I'm sorry, I'll try to do better next time",
                });
                this.item.selectMultiple = false;
                this.item.selectedItems = [];
              },
            );
        }
      });
    }
  }
}
