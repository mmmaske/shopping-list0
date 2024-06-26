import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { debug,loginDetails } from '../utils/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
    email:string = '';
    password: string = '';
    constructor(
        public authServ : AuthService
    ) {}

    handleSignIn():void {
        this.authServ.SignIn(this.email, this.password).then((returned) => {
            debug(loginDetails());
            alert(returned);
        })
        .catch((error) => {
            alert(error);
        });
    }
}
