import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const token = route.queryParamMap.get('token');
    const email = route.queryParamMap.get('email');

    if (token && token.trim() !== '' && email && email.trim() !== '') {
      return true;
    }

    return this.router.createUrlTree(['/forgot-password']);
  }
}
