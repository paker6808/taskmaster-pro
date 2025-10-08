import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle
} from '@angular/material/card';

@Component({
  selector: 'app-not-found',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  // Method to redirect to the dashboard
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
