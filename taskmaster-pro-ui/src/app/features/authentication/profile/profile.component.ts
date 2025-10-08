import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../services/auth.service';
import { ProfileDto } from '../models/profile.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  private originalProfile: ProfileDto | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });

    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.auth.getProfile().subscribe({
      next: (profile) => {
        this.originalProfile = profile;
        this.profileForm.patchValue(profile);
        this.profileForm.markAsPristine();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.show('Failed to load profile.', 'Close');
      }
    });
  }

  onSubmit(): void {
    if (!this.profileForm.valid || !this.isFormChanged || this.loading) return;

    const dto: ProfileDto = {
      email: this.email.value,
      firstName: this.firstName.value?.trim(),
      lastName: this.lastName.value?.trim()
    } as ProfileDto;

    this.loading = true;
    this.auth.updateProfile(dto).subscribe({
      next: () => {
        this.loading = false;
        this.notification.show('Profile updated successfully.', 'Close');
        // reset form to match new "clean" state
        this.profileForm.reset({
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName
        });
        this.profileForm.markAsPristine();
        this.originalProfile = dto;
      },
      error: () => {
        this.loading = false;
        this.notification.show('Failed to update profile.', 'Close');
      }
    });
  }

  cancel(): void {
    if (this.originalProfile) {
      this.profileForm.reset({
        email: this.originalProfile.email,
        firstName: this.originalProfile.firstName,
        lastName: this.originalProfile.lastName
      });
      this.profileForm.markAsPristine();
    }
    this.router.navigate(['/dashboard']);
  }

  goToChangePassword(): void {
    this.router.navigate(['/profile/change-password']);
  }

  // Getters for template error checks
  get email() {
    return this.profileForm.get('email')!;
  }
  get firstName() {
    return this.profileForm.get('firstName')!;
  }
  get lastName() {
    return this.profileForm.get('lastName')!;
  }
  get isFormChanged(): boolean {
    if (!this.originalProfile) return false;
    return this.email.value?.trim() !== this.originalProfile.email?.trim() ||
          this.firstName.value?.trim() !== this.originalProfile.firstName?.trim() ||
          this.lastName.value?.trim() !== this.originalProfile.lastName?.trim();
  }
}