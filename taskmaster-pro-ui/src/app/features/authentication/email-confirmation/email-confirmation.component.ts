import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmEmailDto } from '../models/confirm-email.dto';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-email-confirmed',
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss'
})
export class EmailConfirmationComponent implements OnInit {
  message = '';
  success = false;

 constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    const dto: ConfirmEmailDto = {
      userId: this.route.snapshot.queryParamMap.get('userId') || '',
      token: this.route.snapshot.queryParamMap.get('token') || ''
    };

    if (!dto.userId || !dto.token) {
      this.notification.show('Invalid confirmation link.');
      return;
    }

    this.auth.confirmEmail(dto).subscribe({
      next: () => {
        this.message = 'Your email has been successfully confirmed. You can now log in.';
        this.success = true;
      },
      error: err => {
        this.message = err?.message || 'Email confirmation failed.';
        this.success = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}