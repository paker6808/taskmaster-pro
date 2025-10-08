import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a simple snackbar.
   * @param message  The text to display
   * @param action   The label for the action button (defaults to “Close”)
   * @param duration How long (ms) the snackbar stays open (defaults to 3000ms)
   */
  show(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, { duration });
  }
}