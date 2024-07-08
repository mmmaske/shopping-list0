import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Container } from '../models/container.model';
import { debug, loginDetails } from '../utils/common';
import { User } from '../models/user';
import { AuthService } from './auth';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { connectStorageEmulator } from 'firebase/storage';
import { Observable, combineLatest } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ContainersService {
  private containerPath = '/containers';
  private usersPath = '/users';
  public localUser: User = /*this.authServ.userData*/ loginDetails();
  public userRef = this.db.firestore.doc(`user/${this.localUser.uid}`);
  public containerCollection: any;
  containersRef: AngularFirestoreCollection<Container>;
  usersRef: AngularFirestoreCollection<User>;
  private storage = getStorage();
  public activeContainer: string = '';
  public activeContainerRef?: DocumentReference<Container>;

  constructor(
    private db: AngularFirestore,
    public authServ: AuthService,
  ) {
    if (!environment.production) {
      connectStorageEmulator(this.storage, 'localhost', 9199);
    }
    this.containersRef = db.collection(this.containerPath);
    this.usersRef = db.collection(this.usersPath);
  }

  uploadToFireStore(id: string, file: string): void {
    const fs_container = ref(this.storage, id); // so the image is renamed to the container ID
    const test = uploadString(fs_container, file, 'data_url').then(
      (snapshot) => {
        debug(snapshot);
        return snapshot;
      },
    );
    debug(test);
  }

  getAll(): AngularFirestoreCollection<Container> {
    return this.getUsersContainers();
  }

  getCombined(): Observable<[Container[], Container[]]> {
    const sharedContainers = this.getSharedWith()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      );
    const ownedContainers = this.getUsersContainers()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          })),
        ),
      );
    const combined = combineLatest(sharedContainers, ownedContainers);
    return combined;
  }

  getUsersContainers(): AngularFirestoreCollection<Container> {
    const user = this.userRef;
    return this.db.collection(this.containerPath, (ref) =>
      ref.where('createdBy', '==', user).orderBy('updatedOn', 'desc'),
    );
  }

  getSharedWith(): AngularFirestoreCollection<Container> {
    const user = this.userRef;
    return this.db.collection(this.containerPath, (ref) =>
      ref
        .where('sharedWith', 'array-contains', user.id)
        .orderBy('updatedOn', 'desc'),
    );
  }

  async getContainer(container_id: string) {
    const doc = this.containersRef.doc(container_id);
    return doc.get();
  }

  create(container: Container): any {
    let now = new Date();
    if (this.localUser) {
      return this.containersRef.add({
        ...container,
        createdOn: now,
        updatedOn: now,
        createdBy: this.userRef,
      });
    } else {
      return this.containersRef.add({
        ...container,
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
    return this.containersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.containersRef.doc(id).delete();
  }
}
