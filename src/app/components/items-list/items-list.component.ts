import { Component, Input, OnInit, inject } from '@angular/core';
import { ItemService } from 'src/app/services/items.service';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CamelCasePipe } from 'src/app/camel-case.pipe';
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
    title:'',
    displayImage:'',
    description:'',
  };
  itemContainerData:any;

  constructor(
    private itemService: ItemService,
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
    const ref = await this.containerService.getContainer(this.containerService.activeContainer);
    const data = (await ref.get()).data();
    this.containerData = data;
  }

  ngOnInit(): void {
    this.currentContainerIdSetter();
    this.currentContainerRefSetter();
    // this.retrieveItems();
    this.retrieveByContainer();
    // this.setActiveFromRoute();
  }

  refreshList(): void {
    this.currentItem = undefined;
    this.currentIndex = -1;
    this.retrieveItems();
  }

  retrieveItems(): void {
    // depreciated
    this.itemService.getCombined().subscribe((data) => {
      this.combinedData = []; // clear the combinedData array
      data.map((itemArray) => {
        itemArray.forEach((item) => {
          console.log(item);
          item.priorityClass = item.priority?.replace(/\s/g, ''); // remove spaces from priority
          this.combinedData.push(item); // insert into combinedData array
        });
      });
      this.items = this.combinedData; // output to item list
      this.hasItems = true;
    });
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
        this.items = this.itemContainerData; // output to item list
        this.hasItems = true;
      });

    // this.itemService.getContainedBy(this.currentContainerIdGetter)
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
    this.router.navigate([`/item/${item_id}`]); // update the URL
    this.setActiveFromRoute(index); // update the component
  }

  setActiveFromRoute(index: number = -1) {
    // depreciated
    const retrieved = this.retrieveItem(this.currentItemIdGetter);
    this.setActiveItem(retrieved, index);
  }

  setActiveItem(item: /*Item*/ any, index: number = -1): void {
    this.currentItem = item;
    this.currentIndex = index;
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
}
