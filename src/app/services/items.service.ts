import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Item } from '../models/item.model';
import { debug, loginDetails } from '../utils/common';
import { User } from '../models/user';
import { AuthService } from './auth';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { connectStorageEmulator } from 'firebase/storage';
import { Observable, combineLatest, concat, of } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, from, map } from 'rxjs';
import Swal from 'sweetalert2';
import { Transaction, deleteDoc, runTransaction } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  public selectMultiple: boolean = false;
  public selectedItems: string[] = [];
  private itemPath = '/items';
  private usersPath = '/users';
  public localUser: User = /*this.authServ.userData*/ loginDetails();
  public userRef = this.db.firestore.doc(`user/${this.localUser?.uid}`);
  public itemCollection: any;
  itemsRef: AngularFirestoreCollection<Item>;
  usersRef: AngularFirestoreCollection<User>;

  private storage = getStorage();
  private storageRef = ref(this.storage, 'items');

  constructor(
    private db: AngularFirestore,
    public authServ: AuthService,
  ) {
    if (!environment.production) {
      connectStorageEmulator(this.storage, 'localhost', 9199);
    }
    this.itemsRef = db.collection(this.itemPath);
    this.usersRef = db.collection(this.usersPath);
  }

  uploadToFireStore(id: string, file: string): void {
    const fs_item = ref(this.storage, id); // so the image is renamed to the item ID
    const test = uploadString(fs_item, file, 'data_url').then((snapshot) => {
      debug(snapshot);
      return snapshot;
    });
    debug(test);
  }

  getAll(): AngularFirestoreCollection<Item> {
    return this.getUsersItems();
  }

  getCombined(): Observable<[Item[], Item[]]> {
    const sharedItems = this.getSharedWith()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      );
    const ownedItems = this.getUsersItems()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      );
    const combined = combineLatest(sharedItems, ownedItems);
    return combined;
  }

  getUsersItems(): AngularFirestoreCollection<Item> {
    const user = this.userRef;
    return this.db.collection(this.itemPath, (ref) =>
      ref.where('createdBy', '==', user).orderBy('updatedOn', 'desc'),
    );
  }

  getSharedWith(): AngularFirestoreCollection<Item> {
    const user = this.userRef;
    return this.db.collection(this.itemPath, (ref) =>
      ref
        .where('sharedWith', 'array-contains', user.id)
        .orderBy('updatedOn', 'desc'),
    );
  }

  async getItem(item_id: string) {
    const doc = this.itemsRef.doc(item_id);
    return doc.get();
  }

  create(item: Item): any {
    let now = new Date();
    if (this.localUser) {
      return this.itemsRef.add({
        ...item,
        createdOn: now,
        updatedOn: now,
        sharedWith: [],
        createdBy: this.userRef,
      });
    } else {
      return this.itemsRef.add({
        ...item,
        sharedWith: [],
        createdOn: now,
        updatedOn: now,
      });
    }
  }

  update(id: string, data: any): Promise<void> {
    data.updatedOn = new Date();
    if (typeof data.webcamdata == 'string') {
      this.uploadToFireStore(id, data.webcamdata);
    } //attempt firestore upload
    delete data.webcamdata; // no longer need this since it is uploaded to firestore
    return this.itemsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.itemsRef.doc(id).delete();
  }

  getSelectedItems(
    item_id_array: String[],
  ): AngularFirestoreCollection<unknown> {
    return this.db.collection(this.itemPath, (ref) =>
      ref.where('id', 'in', item_id_array),
    );
  }

  handleDeleteSelected() {
    if (this.selectedItems.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You're going to be deleting ${this.selectedItems.length} items and they can't be recovered.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          const delete$ = this.deleteSelected(this.selectedItems).subscribe(
            () => {
              Swal.fire({
                title: `${this.selectedItems.length} items deleted!`,
                icon: 'success',
                confirmButtonText:
                  'Thank you for deleting those items, shopping list website!',
              });
              this.selectMultiple = false;
              this.selectedItems = [];
            },
            (error) => {
              Swal.fire({
                title: `Unable to delete ${this.selectedItems.length} items!`,
                text: error,
                icon: 'error',
                confirmButtonText: "I'm sorry, I'll try to do better next time",
              });
              this.selectMultiple = false;
              this.selectedItems = [];
            },
          );

        }
      })
      ;
    }
  }

  deleteSelected(documentIds: string[]): Observable<void> {
    return from(
      this.db.firestore.runTransaction(async (transaction) => {
        for (const docId of documentIds) {
          const docRef = this.db.collection('items').doc(docId).ref;
          transaction.delete(docRef);
        }
      }),
    ).pipe(
      map(() => {}),
      catchError((error) => {
        console.error('Error deleting documents in transaction:', error);
        throw error;
      }),
    );
  }
}
