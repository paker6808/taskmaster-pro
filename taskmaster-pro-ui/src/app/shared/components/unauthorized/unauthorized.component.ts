import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle
} from '@angular/material/card';

@Component({
  selector: 'unauthorized',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  // Method to redirect to the dashboard
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
