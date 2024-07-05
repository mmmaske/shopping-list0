import {ChangeDetectionStrategy, Component, inject} from '@angular/core';import { Router } from '@angular/router';
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


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    loggedin:boolean = this.authServ.isLoggedIn;
    title = 'Shopping List';

    imsorry:string = `i̸͇͚̐͛̆̕̚'̸̡̢̡̯͈̯̹͖̭̠͚̥͈͍̖̝̬̹͓̝͚̣̪̝̟̍̅̏̋̍̅̈́̃̀͑̾̿́̌̅̅͐͐͗̃́̋͛̿͑̅̒̑̐͑̀̽̊́̄͊͛̇͘̚̚͜͝͝͝ͅͅm̴̬͔̝̦̝̱̪͇̲̮͍̗̻̼̩̹̗͇̑͋͛͂̅̈́̆̈́̽̿̈̂͊̎͐̐̀̆͛͐̂̅̑̍̆͛͑̕͝͠͝ ̴̨̛̦̗̻͉͚̩̰̤̰̲͚̬͓̳̗͓̖͙̩͈̼̼̬̫̖͚̅̏̅͆̌͑̋̀̄̀̀̈́͗͋͌̊̉͘͝ͅs̷̨̛͙͔̜̘͈̜̞̠̖̬̤͕͕̪̈̐̆͊̏̄̌̑̈͑͂̃̏̌̅̏͊̾̃̋͂̿̄̑͂͐́̒̓̊̕̚̚̚͘͘͘͘͜͠͠͝͝ͅo̷͍̖͈̳͖̰̬̍͐̈́̂̽̿̂̓̃͂͂̄̆̾̏̔̏͐̊͊̓͆̕͠r̷̢̤̜̦͔̜̙̜͎̭̘̫̭̩̮̝̘̯̫̼̖̦̬̺̮̻̔́͌̿̅̉̀̒̀̚͝͠ͅr̶͍̙̫̗͍̱̠̼̗̮͎̠͍̲͙̘̭͠ͅy̸̧̨̡̨̧̧̢̛̛̫͔̞̪̦̼̝͎͙͈̭̜̼̞̮̰̥̫̟̹̩̗̝̹̙̩̥̼̙̑̑̓͛̇̒̂̽͐́̈́̽̑̔͛̌̈́̔̓̅͒̚̚͘͝͠ͅ`;

    dontgo:string = `
    Ḑ̸̧̢̡̡̧̧̧̛̩͙̖̪͉̭͇̙̯̤̟͉̜̠̦̫̗̩̗̯̮̙̮̬̘̥̪͎̯̥̝̳̮̳̼̰̼̝̬͈̫̟͖̤̥̼͇̭̞͕̟͍̣̬͔̪̞̦̘̝̳̬̦͓̟͓͕̖̜̫̜̟̥̫͇̟̱̜̪̲̩̣̪͎̹͙̣̺̣̳̤̣͚̪͕̖̪͚͔͓̝̎̉͊̆͂̂̏͊̇̌͆̂̄͆̄͂͒̾͑́̽̎̍̄̅̂̒̆̅͂̃̃̆͌̃͒̈́͆͐̄̔͆̀͊̅̈́̈̀̽̄̍͋̄̍͑̍́̽͐͑̿͋̚̚͜͜͜͝ͅͅͅÖ̷̧̧̡̡̨̨̨̢̨̧̬͍̯͖̩̠̭̣̰̖͉̼͙̞̘̠̬̤̼̩̱̰̗͙͎̰̤̖̦͕̫͇̠͈̝͈͙͙̦̝̳͔̪͖͎̗͉̘̙̜̼̲̭̼̬̜̯̯̤̺̝̬̘͓̣̝̺̜̫̯̘̘͔̖̥̳͖̝͔̜̤͎͎̰̭͓́̅̂̽̃̆̃̋͌͌̑̏̑̀̓̐̈́̅̀̈̀̆͆̓̇̊͐̕͘͘͜͜͝ͅͅŅ̵̧̢̨̨̧̡̧̧̛̛̛̞͔̠̭̣̻̥̣͎͍͍̬̻̖̤̗̖̼̺̗̣̫̼̤͖͎̪͕̺͍̙̯̬͕̤̠̝̣̤̖̜͇͇̗͎̼̲̖̮͎̳̻̝̟̙̱̫̙̦̺͚̝̳͉͍̤̫̲̯̤͈̖̮̺̟̮͕͍̲̖͚̤͔̭͇͓̩̭͚̥͕̭̯͙̯̦͇͙͉̳̪̱̭̥́̊̾̂̿̆̒̅̒̐̓̓͛͊̈̓̃͊̏͋͛̓̌̌̃̏͐̈̀͆̆̉̾̃̍̎́̊̎̋̅̃̐̏̌̈́̎̀́̋́͋̈́̓̎̋͒͋̌̓̓͛͋̈́̒̋͋̒̑̈́́̔̈́̽͛̇̓͊̐͐͌̾̊̌̆̔̔̂͒̌͗̕͘̚͘̚̕̚̕̕͜͜͜͝͝͠͝͝͝ͅͅ'̷̢̨̨̨̧̨̨̢̡̛͖̟̝̯̻̠̞̤͇̣̝͙̟̠̞̥̩̭̖͓̱̬̞͔̠͍̣͇̘̩̙̰̯͖͇͎̘̗͕͇͇̣̤̩̼͔͖̙̤͚̥̯̥̙͕͕̫̘̻̯̙͕̘̗͕̠̼̺̮͚̺̳͎̥̘̞͉͕͇͓̟̘̭̼̻͕̮̼͓̟̻̘͖͓͍͕͖̩̰͓͂̊̄̇̾́̽̈́͋͒̄̄̋̃͒̿̀̿̍̈́͌͑͑́̓̑̊͋͗̊͒̓̆̆͐͆̀̒̈́̚͘͘͜͜͠͠͝͝͝ͅT̵̡̨̧̧̛̛̪̮̳̖͈̗̙̹͔̣͔̮̯̱͙͖̲̼̭̖͕̺̪̐̅̈́̍͛̏̾̋͒̋̋͐́́͐̏͛̽̒̎̽̀́̾̔̑̓̓̔̑̇̐͊̓̆̄̈́͋̓̏͗̽͋̈́̿͛̎̓̂̂̐͌̐̈̎͋̄̌͛͑̍̓́̋̓̿̋̀̇̿̄̔̑͋̈͋́̊͑̂̅̿̿̑̏̈̀̈́̅̓̎̌̆͊͌̄͒͗̆̈̉͆̌͊̚̕͘̕͝͝͠͠͝͠͝͝͝͝͠͠ͅ ̴̡̬͇̙̫̙̲̳͈̮̩̬͈͍͕̩̥̟͓̩̇̾̾̋͑́͌̃̓̉̀͒̓͂́̑̋̕̚͜͜͜ͅͅḠ̷̢̧̨̨̢̨̛̛̛̣̪̟̼̠͔̺̯̣̰̤͉͉̭̗̙̻͉͈͚̻͎̘̗̰̼̞̥͈̟̩̺̱͎͈̺͔̳̪̊͂̈̆̂̓̔̆͐́͗͗͛͌̍͂͂̂̒́̂̅̒̔͆͌̋̋̊̿͐̉̽͂́͑̊̀̓̓̈̏̄̓́̓͗͌̏̒͛̃̒̆̀̒̀́̑̐̓̄͑̏̂̊̇̊̅͋͐̅͑͘̚͘͘̚͘̕̕̕͘͜͝͝͝͝͝Ơ̸̡̻̫͖̦̳̝̜͓̣̜̺̯̼̬̦̱̠̘̠͓͈̖̪̫̜̮̤̖̞̌̇͛̏̃́̉̔̉̉̎͌̎̄͊̈́̓͂̾̈́͛̈́͊͂́̇̀̌̊̓̀͆͐̇̅̔̀͛̆̇̋̆̈́͑̈́̈̽̈́̽̌̈̈͊̍̋͒̀͊̃̓̂̔̅͂̋̆̽̔͐̈́͒̏̓͘͜͠͝͝͝͝͝ͅͅͅ
    `;


    constructor(
        public authServ:AuthService,
        private router: Router
    ) {}
    public name:string='';
    readonly dialog = inject(MatDialog);

    handleSignOut(): void {
        this.authServ.SignOut().then((returned)=>{
            debug(returned);
            Swal.fire({
                title: `Why are you leaving?`,
                html: `Where are you going? How will you remember what to get there? <h2>🥺</h2> <h3>${this.imsorry}</h3><h1>${this.dontgo}</h1>`,
                icon:'success',
                confirmButtonText:"K"
            });
            this.router.navigate(['']);
        })
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(AddItemComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result !== undefined) {
                this.name= result;
            }
        });
    }
}



// @Component({
//     selector: 'dialog-overview-example-dialog',
//     templateUrl: 'dialog-overview-example-dialog.html',
//     standalone: true,
//   })
// export class DialogOverviewExampleDialog {
//     readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
//     readonly data = inject<DialogData>(MAT_DIALOG_DATA);
//     readonly animal = this.data.animal;

//     onNoClick(): void {
//       this.dialogRef.close();
//     }
//   }