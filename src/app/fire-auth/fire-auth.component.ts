import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-fire-auth',
  templateUrl: './fire-auth.component.html',
  styleUrls: ['./fire-auth.component.css']
})
export class FireAuthComponent implements OnInit {
    email:string="";
    password:string="";
    constructor(private afAuth: AngularFireAuth) { }

    debug(debuggable: any) : void {
        console.log(`debug: ${String(debuggable)}`);
        console.log(typeof(debuggable));
        console.log(debuggable);
    }

    ngOnInit(): void {}

    signUp() {
        this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
        .then((ret) => {
            alert('signup OK');
            this.debug(ret);
        })
        .catch((error) => {
            alert('signup NG');
            this.debug(error);
        });
    }
}
