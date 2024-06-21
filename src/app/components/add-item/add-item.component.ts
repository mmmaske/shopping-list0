import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  item: Item = new Item();
  priorities = ['extra high','high','medium','low'];
  submitted = false;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
  }

  saveItem(): void {
    this.itemService.create(this.item).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newItem(): void {
    this.submitted = false;
    this.item = new Item();
  }
}