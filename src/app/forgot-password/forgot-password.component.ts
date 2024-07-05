import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  doneReset: boolean = false;
  email: string = '';

  constructor(public authServ: AuthService) {}

  handleForgotPassword(): void {
    this.authServ
      .ForgotPassword(this.email)
      .then((returned) => {
        this.doneReset = true;
        Swal.fire({
          title: 'Password reset initiated!',
          text: `We sent a link to ${this.email} with a password reset link. Kindly open the link and set your password to something you'll actually remember, K? 🙄`,
          icon: 'success',
          confirmButtonText:
            "Thanks for letting me reset my password, I'll check my email for the link now",
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Password recovery failure!',
          text: error,
          icon: 'error',
          confirmButtonText: "Oops, I'm sorry, I'll try to do better",
        });
      });
  }
}
