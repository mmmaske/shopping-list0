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
import Swal from 'sweetalert2';
import { ShareContainerFormComponent } from '../share-container-form/share-container-form.component';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

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
  priorityIndexes = ['extrahigh', 'high', 'medium', 'low'];
  combinedData: any;
  containerData: any = {
    title: '',
    displayImage: '',
    description: '',
  };
  itemContainerData: any;
  dragTarget: CdkDrag<any> | undefined;
  mousePosition = {
    x: 0,
    y: 0,
  };

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
          const priorityClass = item.priority?.replace(/\s/g, ''); // remove spaces from priority
          item.priorityClass = priorityClass;

          this.priorityIndexes.forEach((priority, index) => {
            if (priority === priorityClass) item.priorityIndex = index;
          });
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
    } else if (this.setSort === 'priorityIndex') {
      console.log('sort by priorityIndex');
      sorted = sortable.sort(function (a: Item, b: Item) {
        return Number(a.priorityIndex) - Number(b.priorityIndex);
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

  redirectToItem($event: MouseEvent, item_id: any, index: number): void {
    if (
      this.mousePosition.x === $event.screenX &&
      this.mousePosition.y === $event.screenY
    ) {
      if (this.itemService.selectMultiple) return;
      this.router.navigate([`/item/${item_id}`]); // update the URL
    } else {
      if (this.mousePosition.x > $event.screenX) {
        this.swipeTogglePurchased(item_id);
      } else {
        this.swipeDeleteItem(item_id);
      }
    }
  }
  swipeTogglePurchased(currentItem_id: string) {
    console.log(currentItem_id);
    let item: any = [];
    this.itemService
      .getItem(currentItem_id)
      .then((retrieved) => {
        return retrieved.forEach((value) => {
          item = value.data();
          this.itemService
        .update(currentItem_id, { purchased: !item.purchased })
        .then(() => {
            const purchaseMsg = !item.purchased ? "purchased":"consumed";
            Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              })
              .fire({
                icon: "success",
                title: `${item.title} was marked as ${purchaseMsg}.`
              });
        })
        .catch((err) => console.log(err));
        });
    });
}
  swipeDeleteItem(currentItem_id: string) {
    console.log(currentItem_id);
    let item: any = [];
    this.itemService
      .getItem(currentItem_id)
      .then((retrieved) => {
        return retrieved.forEach((value) => {
          item = value.data();
          if (item) {
            Swal.fire({
              title: 'Are you sure?',
              text: `You are deleting ${item.title} from your shopping list. You won't be able to revert this!`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                this.itemService
                  .delete(currentItem_id)
                  .then(() => {
                    this.router.navigate([
                      `container/${this.containerService.activeContainer}`,
                    ]);
                    this.refreshList();
                    Swal.mixin({
                        toast: true,
                        position: "bottom-end",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        }
                      })
                      .fire({
                        icon: "success",
                        title: `${item.title} was removed from your shopping list.`
                      });
                  })
                  .catch((err) => console.log(err));
              }
            });
          }
          console.log(value.data());
          return value.data();
        });
      });
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

  handleDeleteContainer(): void {
    const containerTitle = this.containerData.title;

    if (this.items && this.items.length > 0) {
      Swal.fire({
        title: `Cannot delete ${containerTitle}!`,
        text: `This container still has items. You must delete the items before deleting the container.`,
        icon: 'warning',
        confirmButtonText: `Okay shopping list website, I'll delete the items first.`,
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `You're going to be deleting the ${containerTitle} container and it can't be recovered.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.containerService
            .delete(this.containerService.activeContainer)
            .then(
              (deleteresult) => {
                this.router.navigate(['/containers']);
                Swal.fire({
                  title: `${containerTitle} container deleted!`,
                  icon: 'success',
                  confirmButtonText:
                    'Thank you for deleting that container, shopping list website!',
                });
                console.log(deleteresult);
                return deleteresult;
              },
              (error) => {
                Swal.fire({
                  title: `Unable to delete ${containerTitle} items!`,
                  text: error,
                  icon: 'error',
                  confirmButtonText:
                    "I'm sorry, I'll try to do better next time",
                });
              },
            );
        }
        return result;
      });
    }
  }

  handleShareContainer(): void {
    const dialogRef = this.dialog.open(ShareContainerFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.name = result;
      }
    });
  }

  onMouseDown($event: MouseEvent) {
    console.log($event);
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }
  drop(ev: CdkDragEnd<any>): void {
    console.log('drop event', ev);
    this.dragTarget = ev.source;
    this.dragReset();
    console.log(ev);
  }
  dragReset() {
    this.dragTarget?._dragRef.reset();
  }
}
