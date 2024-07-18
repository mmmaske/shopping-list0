import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { loginDetails, debug } from '../utils/common';

@Component({
  selector: 'app-fire-auth',
  templateUrl: './fire-auth.component.html',
  styleUrls: ['./fire-auth.component.css'],
})
export class FireAuthComponent implements OnInit {
  email: string = '';
  password: string = '';
  UserData: any;
  auth: any;
  loggedin: boolean = this.isLoggedIn;
  login: User = loginDetails();
  constructor(
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router,
  ) {
    this.afAuth.onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        this.UserData = user;
        localStorage.setItem('user', JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
  }

  ngOnInit(): void {}

  signOut(): void {
    localStorage.setItem('user', 'null');
    this.loggedin = false;
  }

  signUp() {
    this.afAuth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((ret) => {
        alert('signup OK');
      })
      .catch((error) => {
        alert('signup NG');
      });
  }

  signIn() {
    this.afAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then((result: any) => {
        this.UserData = result.user;
        this.loggedin = true;
        window.alert(`logged in as ${result.user.email}`);

        localStorage.setItem('user', JSON.stringify(this.UserData));
        this.login = result.user;

        // this.ngZone.run(() => {
        //     this.router.navigate(['/list']);
        // });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}
