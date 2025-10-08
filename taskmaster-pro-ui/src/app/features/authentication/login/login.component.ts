import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit(): void {
     if (this.loginForm.invalid)
      return;

    const dto: LoginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(dto).subscribe({
      next: () => {
        this.notification.show('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        if (err.message === 'EmailNotConfirmed') {
          this.notification.show('Your email isn\'t confirmed yet. Check your inbox.', 'Close');
        }
        else {
          this.notification.show('Invalid credentials', 'Close');
        }
      }
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
