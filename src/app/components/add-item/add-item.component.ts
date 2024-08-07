import { Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ContainersService } from 'src/app/services/containers.service';
import { map } from 'rxjs';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent {
  selectedIcon: string | undefined;
  item: Item = new Item();
  form = this.item;
  priorities = ['extra high', 'high', 'medium', 'low'];
  submitted = false;
  readonly dialogRef = inject(MatDialogRef<AddItemComponent>);

  constructor(
    private itemService: ItemService,
    private router: Router,
    private containerService: ContainersService,
  ) {
    this.form.quantity = 1;
    this.form.estimatedPrice = 0;
    this.form.priority = 'low';
  }

  saveItem(): void {
    this.form.containerId = this.containerService.activeContainer;
    this.form.containerRef = this.containerService.activeContainerRef;

    this.itemService.create(this.form).then(() => {
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
          this.router.navigate([
            `container/${this.containerService.activeContainer}`,
          ]);
        }
      });
    });
  }

  onSubmit(): void {
    this.dialogRef.close();
    this.saveItem();
  }

  onReset(form: NgForm): void {
    form.reset();
  }

  receiveIcon(): void {}
}
