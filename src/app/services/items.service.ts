import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Item } from '../models/item.model';
import { debug,loginDetails } from '../utils/common';
import { User } from '../models/user';
import { AuthService } from './auth';
import { getStorage, ref, uploadString } from "firebase/storage";
import { Query,QuerySnapshot } from '@angular/fire/compat/firestore';
@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private allowGetAll:boolean = true;
    private dbPath = '/items';
    public localUser:User = /*this.authServ.userData*/loginDetails();
    public userRef = this.db.firestore.doc(`user/${this.localUser.uid}`);
    itemsRef: AngularFirestoreCollection<Item>;
    usersRef: AngularFirestoreCollection<User>;


    private storage = getStorage();
    private storageRef = ref(this.storage, 'items');


    constructor(
        private db: AngularFirestore,
        public authServ: AuthService
    ) {
        this.itemsRef = db.collection(this.dbPath);
        this.usersRef = db.collection('users');
    }

    uploadToFireStore(id:string,file:string): void {
        const fs_item = ref(this.storage, id); // so the image is renamed to the item ID
        const test = uploadString(fs_item, file, 'data_url').then((snapshot) => {
            debug(snapshot);
            return snapshot;
        });
        debug(test);
    }

    getAll(): AngularFirestoreCollection<Item> {
        return this.getUsersItems();
        // if(this.localUser) return this.getUsersItems();
        // return this.itemsRef;
    }

    getUsersItems(): AngularFirestoreCollection<Item> {
        const user = this.userRef;
        return this.db.collection(this.dbPath,ref=>ref.where('createdBy','==',user).orderBy('updatedOn', 'desc'));
    }

    async getItem(item_id:string) {
        const doc = this.itemsRef.doc(item_id);
        return doc.get();
    }

    create(item: Item): any {
        let now = new Date();
        if(this.localUser) {
            return this.itemsRef.add({
                ...item,
                createdOn: now,
                updatedOn: now,
                createdBy:this.userRef,
            });
        }
        else {
            return this.itemsRef.add({
                ...item,
                createdOn: now,
                updatedOn: now,
            });
        }
  }

    update(id: string, data: any): Promise<void> {
        data.updatedOn = new Date();
        if(typeof(data.webcamdata)=='string') { this.uploadToFireStore(id,data.webcamdata); } //attempt firestore upload
        delete data.webcamdata; // no longer need this since it is uploaded to firestore
        return this.itemsRef.doc(id).update(data);
  }

    delete(id: string): Promise<void> {
        return this.itemsRef.doc(id).delete();
    }
}