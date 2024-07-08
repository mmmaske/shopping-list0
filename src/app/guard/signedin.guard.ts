import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SignedinGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn && this.authService.isVerified) {
      this.router.navigate(['containers']);
    }
    return true;
  }
}
