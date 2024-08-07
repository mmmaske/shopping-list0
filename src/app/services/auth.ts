import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { environment } from '../environments/environment';
import { authStateActions } from '../auth.actions';
import { Store } from '@ngrx/store';
import { initialUserState } from '../auth.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public store: Store,
  ) {
    // for firebase emulator
    if (!environment.production)
      this.afAuth.useEmulator('http://localhost:9099');

    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        return this.afAuth.authState.subscribe((user) => {
          const action = user ? user : initialUserState;
          this.dispatchLogin(action);
          return user;
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        return 'Password reset email sent, check your inbox.';
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null /*&& user.emailVerified !== false*/ ? true : false;
  }
  get isVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  GetUserData(user: any) {
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userData;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`,
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.store.dispatch(authStateActions.logout());
      localStorage.removeItem('user');
    });
  }

  async GoogleAuth() {
    const provider = new GoogleAuthProvider();
    const userData = await this.afAuth.signInWithPopup(provider).then((val) => {
      const user = val.user ? val.user : initialUserState;
      this.dispatchLogin(user);
      return val.user;
    });
    await this.SetUserData(userData);
    return this.GetUserData(userData);
  }

  searchByEmail(email: string): Observable<{ id: string; data: any }> {
    return this.afs
      .collection('users', (ref) => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          // If there is exactly one matching document, return its ID
          if (actions.length == 1) {
            const id = actions[0].payload.doc.id;
            const data = actions[0].payload.doc.data();
            return { id: id, data: data };
          } else {
            throw new Error('No document found with the specified email');
          }
        }),
      );
  }

  dispatchLogin(user: User) {
    const action = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.store.dispatch(authStateActions.login({ userdata: action }));
  }
}
