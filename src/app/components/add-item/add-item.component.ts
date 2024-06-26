import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
    item: Item = new Item();
    form = this.item;
    priorities = ['extra high','high','medium','low'];
    submitted = false;

    constructor(private itemService: ItemService,private router: Router) { }

    saveItem(): void {
        this.itemService.create(this.form).then(() => {
            console.log('Created new item successfully!');
            Swal.fire({
                title: `${this.form.title} added to your shopping list.`,
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                }).then((result) => {
                    this.form = new Item();
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                    this.router.navigate(['list']);
                }
            });
        });
    }

    onSubmit(): void {
        console.log(JSON.stringify(this.form, null, 2));
        this.saveItem();
    }

    onReset(form: NgForm): void {
        form.reset();
    }
}