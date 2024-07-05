import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { debug, loginDetails } from '../utils/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  constructor(
    public authServ: AuthService,
    private router: Router,
  ) {}

  handleGoogleSSO(): void {
    this.authServ
      .GoogleAuth()
      .then((returned) => {
        const userData = this.authServ.userData;
        debug(userData.toJSON());
        this.router.navigate(['']);
        Swal.fire({
          title: 'You did it',
          text: `You're logged in as ${userData.email}!`,
          icon: 'success',
          confirmButtonText:
            'Thank you for letting me log in, shopping list website!',
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Login failure!',
          text: error,
          icon: 'error',
          confirmButtonText: "Oops, I'm sorry, I'll try to do better",
        });
      });
  }

  handleSignIn(): void {
    this.authServ
      .SignIn(this.email, this.password)
      .then((returned) => {
        debug(loginDetails());
        this.router.navigate(['list']);
        Swal.fire({
          title: 'You did it',
          text: `You're logged in as ${this.email}!`,
          icon: 'success',
          confirmButtonText:
            'Thank you for letting me log in, shopping list website!',
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Login failure!',
          text: error,
          icon: 'error',
          confirmButtonText: "Oops, I'm sorry, I'll try to do better",
        });
      });
  }
}
