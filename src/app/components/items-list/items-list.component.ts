import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/items.service';
import { map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CamelCasePipe } from 'src/app/camel-case.pipe';

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

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  get currentItemIdGetter() {
    return String(this.route.snapshot.paramMap.get('item_id'));
  }

  ngOnInit(): void {
    this.retrieveItems();
    this.setActiveFromRoute();
  }

  refreshList(): void {
    this.currentItem = undefined;
    this.currentIndex = -1;
    this.retrieveItems();
  }

  retrieveItems(): void {
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
  deleteSelected() {
    // todo: use firebase transactions to delete the selected items
  }
}
