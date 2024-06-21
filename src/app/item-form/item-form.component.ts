import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent {
    priorities = ['extra high','high','medium','low'];
    form = {
        title: '',
        description: '',
        quantity: '',
        priority: '',
    };

    onSubmit(): void {
        console.log(JSON.stringify(this.form, null, 2));
    }

    onReset(form: NgForm): void {
        form.reset();
    }
}