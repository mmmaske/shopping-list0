import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { debug,loginDetails } from '../utils/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
    email:string = '';
    password: string = '';
    constructor(
        public authServ : AuthService,
        private router: Router
    ) {}

    handleSignIn():void {
        this.authServ.SignIn(this.email, this.password).then((returned) => {
            debug(loginDetails());
            alert(returned);
            this.router.navigate(['list']);
        })
        .catch((error) => {
            alert(error);
        });
    }
}
