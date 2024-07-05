import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { debug } from '../utils/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
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

  handleSignUp(): void {
    this.authServ
      .SignUp(this.email, this.password)
      .then(() => {
        Swal.fire({
          title: 'Sign up successful!',
          text: `You did it! ... Well not quite, you still have to verify your email address. Please check ${this.email} for our verification link!`,
          icon: 'success',
          confirmButtonText: `Thank you for letting me register, I'll verify my email right now!`,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Sign up failure!',
          text: error,
          icon: 'error',
          confirmButtonText: "Oops, I'm sorry, I'll try to do better",
        });
      });
  }
}
