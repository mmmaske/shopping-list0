import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Container } from '../models/container.model';
import { debug, loginDetails } from '../utils/common';
import { User } from '../models/user';
import { userContainer } from '../models/userContainer.model';
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
  private userContainerPath = '/userContainer';
  public localUser: User = /*this.authServ.userData*/ loginDetails();
  public userRef = this.db.firestore.doc(`user/${this.localUser?.uid}`);
  public containerCollection: any;
  containersRef: AngularFirestoreCollection<Container>;
  containerRef?: DocumentReference<Container>;
  userContainerRef: AngularFirestoreCollection<userContainer>;
  userContainer?: DocumentReference<userContainer>;
  containerData?: Object;
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
    this.userContainerRef = db.collection(this.userContainerPath);
  }

  uploadToFireStore(id: string, file: string): void {
    const fs_container = ref(this.storage, id); // so the image is renamed to the container ID
    const test = uploadString(fs_container, file, 'data_url').then(
      (snapshot) => {
        return snapshot;
      },
    );
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
    const doc = await this.db.firestore
      .collection(`containers`)
      .doc(container_id);
    this.containerRef = doc;
    this.containerData = (await doc.get()).data();
    return this.containerRef;
  }

  create(container: Container): any {
    let now = new Date();
    if (this.localUser) {
      return this.containersRef
        .add({
          ...container,
          createdOn: now,
          updatedOn: now,
          createdBy: this.userRef,
        })
        .then(async (created) => {
          return await this.createReference(created);
        });
    } else {
      return this.containersRef.add({
        ...container,
        createdOn: now,
        updatedOn: now,
      });
    }
  }

  async createReference(created: DocumentReference<Container>): Promise<{}> {
    return this.userContainerRef.add({
      createdBy: this.userRef,
      userRef: this.userRef,
      containerRef: created,
      createdOn: new Date(),
    });
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

  async share(container_id: string, user_id: string) {
    const userRef = this.db.firestore.doc(`user/${user_id}`);
    const containerRef = this.db.firestore.doc(`containers/${container_id}`);
    const xref = await this.userContainerRef.add({
      createdBy: this.userRef,
      userRef: userRef,
      containerRef: containerRef,
      createdOn: new Date(),
    });
    return xref;
  }
}
