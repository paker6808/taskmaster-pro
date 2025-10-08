import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  passwordStrength: number = 0; // 0–100 scale
  passwordStrengthLabel = 'Weak';
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.matchPasswords('newPassword', 'confirmPassword')
    });

    // Password strength detector
    this.newPassword.valueChanges.subscribe(value => {
      const score = this.calculatePasswordStrength(value);
      this.passwordStrength = score;

      if (score < 40) {
        this.passwordStrengthLabel = 'Weak';
      } else if (score < 60) {
        this.passwordStrengthLabel = 'Medium';
      } else if (score < 80) {
        this.passwordStrengthLabel = 'Strong';
      } else {
        this.passwordStrengthLabel = 'Very Strong';
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) 
      return;

    const dto = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmPassword
    };

    this.authService.changePassword(dto).subscribe({
      next: () => {
        this.notification.show('Password changed successfully.');
        this.router.navigate(['/profile']);
      },
      error: err => {
        if (err.code === 'CurrentPasswordIncorrect') {
          this.currentPassword.setErrors({ incorrect: true });
        } else {
          this.notification.show('Password change failed.', 'Close');
        }
      }
    });
  }

  matchPasswords(pwKey: string, confirmKey: string) {
    return (group: FormGroup) => {
      const pw = group.controls[pwKey];
      const cp = group.controls[confirmKey];
      if (pw.value !== cp.value) cp.setErrors({ mismatch: true });
      else cp.setErrors(null);
    };
  }

  // Calculate password strength based on length, case, digits, and symbols
  calculatePasswordStrength(pw: string): number {
    let score = 0;
    if (!pw) return 0;
    score += Math.min(10, pw.length) * 5;              // up to 50%
    if (/[A-Z]/.test(pw)) score += 15;                 // uppercase bonus
    if (/[a-z]/.test(pw)) score += 15;                 // lowercase bonus
    if (/\d/.test(pw))  score += 10;                   // digits
    if (/[\W_]/.test(pw)) score += 10;                 // symbols
    return Math.min(score, 100);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Getters for easier access in template
  get currentPassword() {
    return this.changePasswordForm.get('currentPassword')!;
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword')!;
  }
  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword')!;
  }
}
