import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  item: Item = new Item();
  priorities = ['extra high','high','medium','low'];
  submitted = false;

  constructor(private itemService: ItemService,private router: Router) { }

  saveItem(): void {
    this.itemService.create(this.item).then(() => {
        console.log('Created new item successfully!');
        Swal.fire({
            title: `${this.item.title} added to your shopping list.`,
            timer: 1500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            }).then((result) => {
                this.item = new Item();
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
                this.router.navigate(['list']);
            }
        });
    });
  }
}