import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { connectStorageEmulator } from 'firebase/storage';
import { connect } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, startWith } from 'rxjs';
import { loginDetails } from 'src/app/utils/common';
import { environment } from 'src/app/environments/environment';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContainersService } from 'src/app/services/containers.service';
import { Container } from 'src/app/models/container.model';
@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit {
  @Input() item?: Item;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentItem: Item | any = {
    id: '',
    title: '',
    quantity: 0,
    description: '',
    priority: '',
    purchased: false,
    sharedWith: [],
    estimatedPrice: 0,
    containerRef: Container,
  };
  message = '';
  edit = false;
  priorities = ['extra high', 'high', 'medium', 'low'];
  webcamdata: any = null;
  fs_image: any = null;
  usersOptions = [];

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    private cont: ContainersService,
  ) {}

  ngOnInit(): void {
    this.message = '';
    this.cont.activeContainer = '';
    this.setActiveFromRoute();
  }
  setActiveFromRoute() {
    const item_id = String(this.route.snapshot.paramMap.get('item_id'));
    const retrieved = this.retrieveItem(item_id);
    this.setActiveItem(retrieved);
  }

  setActiveItem(item: any): void {
    this.currentItem = item;
  }

  retrieveItem(item_id: string) {
    if (item_id !== 'null') {
      const fb_item = this.itemService.getItem(item_id);
      this.usersOptions = this.retrieveActiveUsers();
      fb_item.then((retrieved) => {
        retrieved.forEach((value) => {
          this.currentItem = value.data(); // data can be accessed here
          this.retrieveItemImage(item_id);
          this.currentItem.id = item_id;
          this.currentItem.createdOnDisplay = new Date(
            this.currentItem.createdOn.seconds * 1000,
          );
          this.currentItem.updatedOnDisplay = new Date(
            this.currentItem.updatedOn.seconds * 1000,
          );
          return value.data();
        });
      });
    }
  }

  retrieveActiveUsers() {
    const usersOptions: any = [];
    const users = this.afs
      .collection('/users')
      .get()
      .subscribe((val) => {
        val.docs.map((user) => {
          const userData: any = user.data();
          const localUserData = loginDetails();
          if (localUserData.uid != userData.uid) {
            userData.displayName = userData.displayName
              ? userData.displayName
              : userData.email;
            console.log(userData);
            usersOptions.push(userData);
          }
        });
      });
    return usersOptions;
  }

  retrieveItemImage(item_id: string) {
    const storage = getStorage();
    if (!environment.production) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    const gsReference = ref(storage, `${item_id}`);
    getDownloadURL(gsReference)
      .then((url) => {
        this.fs_image = url;
        return url;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  ngOnChanges(): void {
    this.message = '';
    this.currentItem = { ...this.item };
    this.edit = false;
  }

  updatePurchased(status: boolean): void {
    if (this.currentItem.id) {
      this.itemService
        .update(this.currentItem.id, { purchased: status })
        .then(() => {
          this.currentItem.purchased = status;
          this.message = 'The status was updated successfully!';
        })
        .catch((err) => console.log(err));
    }
  }

  updateItem(): void {
    const data = {
      title: this.currentItem.title,
      description: this.currentItem.description,
      quantity: this.currentItem.quantity,
      priority: this.currentItem.priority,
      webcamdata: this.webcamdata,
      sharedWith: this.currentItem.sharedWith,
      estimatedPrice: Number(this.currentItem.estimatedPrice),
    };

    if (this.currentItem.id) {
      this.itemService
        .update(this.currentItem.id, data)
        .then(() => {
          this.message = 'The item was updated successfully!';
          Swal.fire({
            title: `${this.currentItem.title} updated successfully.`,
            timer: 1500,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        })
        .catch((err) => console.log(err));
      this.edit = false;
      if (this.webcamdata) {
        this.fs_image = this.webcamdata;
      }
    }
  }

  editItem(): void {
    this.edit = true;
  }
  cancelEdit(): void {
    this.edit = false;
  }

  deleteItem(): void {
    if (this.currentItem.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.itemService
            .delete(this.currentItem.id)
            .then(() => {
              this.router.navigate([`container/${this.cont.activeContainer}`]);
              this.refreshList.emit();
              Swal.fire({
                title: `${this.currentItem.title} was removed from your shopping list.`,
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                },
              });
              this.message = 'The item was updated successfully!';
            })
            .catch((err) => console.log(err));
        }
      });
    }
  }

  handleDataFromChild(data: any) {
    this.webcamdata = data;
  }
}
