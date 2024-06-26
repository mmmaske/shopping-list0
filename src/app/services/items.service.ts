import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from '../models/item.model';
import { debug,loginDetails } from '../utils/common';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private dbPath = '/items';
    private localUser:User = loginDetails();
    itemsRef: AngularFirestoreCollection<Item>;
    usersRef: AngularFirestoreCollection<User>;

    constructor(
        private db: AngularFirestore,
    ) {
        this.itemsRef = db.collection(this.dbPath);
        this.usersRef = db.collection('users');
    }

    getAll(): AngularFirestoreCollection<Item> {
        if(loginDetails()) {
            return this.getUsersItems();
        }
        return this.itemsRef;
    }

    getUsersItems(): AngularFirestoreCollection<Item> {
        return this.db.collection(this.dbPath,ref=>ref.where('createdById','==',`${this.localUser.uid}`));
    }

    async getItem(item_id:string) {
        const doc = this.itemsRef.doc(item_id);
        return doc.get();
    }

    create(item: Item): any {
        let now = new Date();
        return this.itemsRef.add({ ...item,createdOn: now});
  }

    update(id: string, data: any): Promise<void> {
        data.updatedOn = new Date();
        return this.itemsRef.doc(id).update(data);
  }

    delete(id: string): Promise<void> {
        return this.itemsRef.doc(id).delete();
    }
}