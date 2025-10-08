import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityQuestionService } from '../services/security-question.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionGuard implements CanActivate {

  constructor(
    private router: Router,
    private securityQuestionService: SecurityQuestionService
  ) {}

  canActivate(): boolean {
    try {
      const canAccess = this.securityQuestionService.isQuestionLoaded();
      if (!canAccess) {
        this.router.navigate(['/forgot-password']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['/forgot-password']);
      return false;
    }
  }
}
