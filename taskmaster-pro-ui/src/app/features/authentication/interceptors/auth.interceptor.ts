import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn):
  Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    tap({
      error: (err: any) => {
        const isVerifyAnswerCall = req.url.includes('/verify-security-answer');
        if (err.status === 401 && !isVerifyAnswerCall) {
          localStorage.removeItem('jwt');
          router.navigate(['/login']);
        }
      }
    })
  );
}

