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

  create(item: Item): any {
    return this.itemsRef.add({ ...item });
  }

  update(id: string, data: any): Promise<void> {
    return this.itemsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.itemsRef.doc(id).delete();
  }
}