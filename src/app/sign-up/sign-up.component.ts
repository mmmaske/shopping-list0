import { Component } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
    email:string = '';
    password: string = '';
    constructor(
        public authServ : AuthService
    ) {}

    handleSignUp():void {
        this.authServ.SignUp(this.email, this.password).then((returned) => {
            alert(returned);
        })
        .catch((error) => {
            alert(error);
        });
    }
}
