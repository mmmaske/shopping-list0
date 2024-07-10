import { Component, Input, OnInit, inject } from '@angular/core';
import { ItemService } from 'src/app/services/items.service';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CamelCasePipe } from 'src/app/camel-case.pipe';
import { Injectable } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { AddItemComponent } from '../add-item/add-item.component';
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

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css'],
})
export class ItemsListComponent implements OnInit {
  items?: Item[];
  currentItem?: Item;
  currentIndex = -1;
  currentItemId: string = this.currentItemIdGetter;
  hasItems = false;
  sortableColumns: Array<string> = ['title', 'estimatedPrice', 'updatedOn'];
  setSort = 'updatedOn';
  setSortDirection: 'asc' | 'desc' = 'asc';
  isSelect = false;
  data = this.itemService
    .getAll()
    .snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((c) => ({ id: c.payload.doc.id, ...c.payload.doc.data() })),
      ),
    );
  combinedData: any;
  containerData: any = {
    title: '',
    displayImage: '',
    description: '',
  };
  itemContainerData: any;

  constructor(
    public itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    public containerService: ContainersService,
  ) {}
  readonly dialog = inject(MatDialog);

  get currentItemIdGetter() {
    return String(this.route.snapshot.paramMap.get('item_id'));
  }
  get currentContainerIdGetter() {
    return String(this.route.snapshot.paramMap.get('container_id'));
  }

  currentContainerIdSetter() {
    this.containerService.activeContainer = this.currentContainerIdGetter;
  }
  async currentContainerRefSetter() {
    const ref = await this.containerService.getContainer(
      this.containerService.activeContainer,
    );
    const data = (await ref.get()).data();
    this.containerData = data;
  }

  ngOnInit(): void {
    this.currentContainerIdSetter();
    this.currentContainerRefSetter();
    this.retrieveByContainer();
  }

  refreshList(): void {
    this.itemService.selectedItems = [];
    this.currentItem = undefined;
    this.currentIndex = -1;
    this.retrieveByContainer();
  }

  retrieveByContainer(): void {
    this.itemService
      .getContainedBy(this.currentContainerIdGetter)
      .subscribe((data) => {
        this.itemContainerData = [];
        data.map((item: any) => {
          item.priorityClass = item.priority?.replace(/\s/g, ''); // remove spaces from priority
          console.log(item);
          this.itemContainerData.push(item);
        });

        const sorted = this.sortData(this.itemContainerData);
        console.log(sorted);

        this.items = sorted; // output to item list
        this.hasItems = true;
      });

    // this.itemService.getContainedBy(this.currentContainerIdGetter)
  }

  sortData(sortable: []): any {
    let sorted: Array<Item> = [];
    this.setSortDirection = 'asc';
    if (this.setSort === 'title') {
      console.log('sort by title');
      sorted = sortable.sort(function (a: Item, b: Item) {
        let x: any = a.title?.toLowerCase();
        let y: any = b.title?.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    } else if (this.setSort === 'updatedOn') {
      console.log('sort by updatedOn');
      sorted = sortable.sort(function (a: Item, b: Item) {
        return Number(a.updatedOn) - Number(b.updatedOn);
      });
      this.setSortDirection = 'desc';
    } else if (this.setSort === 'estimatedPrice') {
      console.log('sort by estimatedPrice');
      sorted = sortable.sort(function (a: Item, b: Item) {
        return Number(a.estimatedPrice) - Number(b.estimatedPrice);
      });
    }

    if (this.setSortDirection === 'desc') {
      sorted.reverse();
    }
    return sorted;
  }

  retrieveItem(item_id: string) {
    const fb_item = this.itemService.getItem(item_id);
    fb_item.then((retrieved) => {
      retrieved.forEach((value) => {
        this.currentItem = value.data(); // data can be accessed here
        this.currentItemId = this.currentItemIdGetter;
        return value.data(); // needs to be transformed into Item object(?)
      });
    });
  }

  redirectToItem(item_id: any, index: number): void {
    if (this.itemService.selectMultiple) return;
    this.router.navigate([`/item/${item_id}`]); // update the URL
  }

  setActiveItem(item: /*Item*/ any, index: number = -1): void {
    this.currentItem = item;
    this.currentIndex = index;
  }

  updateCheckbox(event: MatCheckboxChange) {
    if (event.checked)
      this.itemService.selectedItems.push(event.source.value); // save document ID selectedItems
    else {
      //remove item ID from selectedItems
      const index = this.itemService.selectedItems.indexOf(event.source.value);
      if (index > -1) {
        this.itemService.selectedItems.splice(index, 1);
      }
    }
    this.itemService.selectedItems.length;
    console.log('count selectedItems', this.itemService.selectedItems.length);
    console.log('selectedItems', this.itemService.selectedItems);
    // get checked elements from checkboxes
  }
  toggleSelect() {
    this.isSelect = !this.isSelect;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.name = result;
      }
    });
  }

  changeSortCol(): void {
    this.refreshList();
  }
}
