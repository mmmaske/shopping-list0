import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from '../models/item.model';
import { debug,loginDetails } from '../utils/common';
import { User } from '../models/user';
import { AuthService } from './auth';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private allowGetAll:boolean = true;
    private dbPath = '/items';
    public localUser:User = /*this.authServ.userData*/loginDetails();
    itemsRef: AngularFirestoreCollection<Item>;
    usersRef: AngularFirestoreCollection<User>;

    constructor(
        private db: AngularFirestore,
        public authServ: AuthService
    ) {
        this.itemsRef = db.collection(this.dbPath);
        this.usersRef = db.collection('users');
    }

    getAll(): AngularFirestoreCollection<Item> {
        return this.getUsersItems();
        // if(this.localUser) return this.getUsersItems();
        // return this.itemsRef;
    }

    getUsersItems(): AngularFirestoreCollection<Item> {
        const localUserData = this.localUser ? this.localUser : {uid:'x'};
        //*
        // query by string field
        return this.db.collection(
            this.dbPath,ref=>ref.where('createdById','==',`${localUserData.uid}`));
        /*/
        //query by reference field
        const user = this.usersRef.doc(this.localUser.uid);
        debug(user);
        return this.db.collection(this.dbPath,ref=>ref.where('createdBy','==',user));
        //*/
    }

    async getItem(item_id:string) {
        const doc = this.itemsRef.doc(item_id);
        return doc.get();
    }

    create(item: Item): any {
        let now = new Date();
        if(this.localUser) {
            return this.itemsRef.add({ ...item,createdOn: now,createdById:this.localUser.uid});
        }
        else {
            return this.itemsRef.add({ ...item,createdOn: now});
        }
  }

    update(id: string, data: any): Promise<void> {
        data.updatedOn = new Date();
        return this.itemsRef.doc(id).update(data);
  }

    delete(id: string): Promise<void> {
        return this.itemsRef.doc(id).delete();
    }
}