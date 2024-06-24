import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from '../models/item.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private dbPath = '/items';

    itemsRef: AngularFirestoreCollection<Item>;

    constructor(private db: AngularFirestore) {
        this.itemsRef = db.collection(this.dbPath);
    }

    getAll(): AngularFirestoreCollection<Item> {
        return this.itemsRef;
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