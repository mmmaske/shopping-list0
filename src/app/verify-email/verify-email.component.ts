import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  constructor(public authServ: AuthService) {}

  ngOnInit(): void {}
}
