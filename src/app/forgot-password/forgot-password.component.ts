import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    constructor(
        public authServ: AuthService
    ) {}

    ngOnInit(): void {}
}
