import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  @Input() item?: Item;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentItem: Item = {
    title: '',
    description: '',
    published: false
  };
  message = '';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentItem = { ...this.item };
  }

  updatePublished(status: boolean): void {
    if (this.currentItem.id) {
      this.itemService.update(this.currentItem.id, { published: status })
      .then(() => {
        this.currentItem.published = status;
        this.message = 'The status was updated successfully!';
      })
      .catch(err => console.log(err));
    }
  }

  updateItem(): void {
    const data = {
      title: this.currentItem.title,
      description: this.currentItem.description
    };

    if (this.currentItem.id) {
      this.itemService.update(this.currentItem.id, data)
        .then(() => this.message = 'The item was updated successfully!')
        .catch(err => console.log(err));
    }
  }

  deleteItem(): void {
    if (this.currentItem.id) {
      this.itemService.delete(this.currentItem.id)
        .then(() => {
          this.refreshList.emit();
          this.message = 'The item was updated successfully!';
        })
        .catch(err => console.log(err));
    }
  }
}