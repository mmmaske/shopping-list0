import { Injectable, getModuleFactory } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
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
import { switchMap } from 'rxjs';

import { ContainersService } from './containers.service';
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
    private cont: ContainersService,
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
      return snapshot;
    });
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

  getContainedBy(container_id: string): Observable<any> {
    return this.containedByCollection(container_id)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      );
  }

  containedByCollection(
    container_id: string,
  ): AngularFirestoreCollection<Item> {
    const container: DocumentReference = this.db.firestore.doc(
      `containers/${container_id}`,
    );
    return this.db.collection(this.itemPath, (ref) =>
      ref.where('containerRef', '==', container).orderBy('updatedOn', 'desc'),
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
    const container_id = this.cont.activeContainer;
    const containerRef = this.db.firestore.doc(`containers/${container_id}`);
    if (this.localUser) {
      return this.itemsRef.add({
        ...item,
        createdOn: now,
        updatedOn: now,
        sharedWith: [],
        createdBy: this.userRef,
        containerRef: containerRef,
      });
    } else {
      return this.itemsRef.add({
        ...item,
        sharedWith: [],
        createdOn: now,
        updatedOn: now,
        containerRef: containerRef,
      });
    }
  }

  update(id: string, data: any): Promise<void> {
    data.updatedOn = new Date();
    if (typeof data.webcamdata === 'string') {
        data.displayImage = data.webcamdata;
        delete data.webcamdata;
    } //attempt firestore upload
    if (data.estimatedPrice < '0') {
      data.estimatedPrice = 0;
    }
    if (typeof data.description === 'undefined') {
      data.description = '';
    }
    // delete data.webcamdata; // no longer need this since it is uploaded to firestore
    console.log('desc',data.description);
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

  purchaseSelected(documentIds: string[]): Observable<void> {
    return from(
      this.db.firestore.runTransaction(async (transaction) => {
        for (const docId of documentIds) {
          const docRef = this.db.collection('items').doc(docId).ref;
          const docSnap = await docRef.get();
          if (docSnap.exists) {
            const data = docSnap.data() as { purchased?: boolean };
            if (data && data.purchased !== undefined) {
              const purchased = data.purchased;
              transaction.update(docRef, {
                purchased: !purchased,
              });
            }
          }
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
