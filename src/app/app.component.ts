import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { debug } from './utils/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
    loggedin:boolean = this.authServ.isLoggedIn;
    title = 'Shopping List';


    constructor(
        public authServ:AuthService,
        private router: Router
    ) {}
    get isLoggedIn(): boolean {
        const token = localStorage.getItem('user')
        const user = JSON.parse(token as string);
        return user !== null ? true : false;
    }

    handleSignOut(): void {
        this.authServ.SignOut().then((returned)=>{
            debug(returned);
            alert(returned);
            this.router.navigate(['list']);
        })
    }
}
