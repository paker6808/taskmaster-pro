import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, first, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAdmin$.pipe(
      first(),
      map(isAdmin => {
        if (isAdmin) return true;
        return this.router.createUrlTree(['/unauthorized']);
      }),
      catchError(() => of(this.router.createUrlTree(['/unauthorized'])))
    );
  }
}
