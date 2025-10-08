import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { DialogService } from '../../../shared/services/dialog.service';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserDetailDto } from '../models/user-detail.dto';
import { UpdateUserRolesDto } from '../models/update-user-roles.dto';
import { UserRolesDialogComponent } from '../user-roles-dialog/user-roles-dialog.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class UserDetailComponent implements OnInit {
  user: UserDetailDto | null = null;
  canEdit = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notificationService.show('User ID not provided.', 'Close');
      return;
    }

    this.adminService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: () => {
        this.notificationService.show('Failed to load user details.', 'Close');
      }
    });
  }

  copyId() {
    if (!this.user?.id) return;
    this.clipboard.copy(this.user.id);
    this.notificationService.show('User ID copied to clipboard');
  }

  openEditRoles(): void {
    if (!this.user) return;

    this.dialogService.open<{ userId: string; currentRoles?: string[] }, string[]>(
      UserRolesDialogComponent,
      {
        width: '400px',
        data: { userId: this.user.id, currentRoles: this.user.roles }
      }
    ).subscribe((updatedRoles) => {
      if (updatedRoles && this.user) {
        const dto: UpdateUserRolesDto = { roles: updatedRoles, userId: this.user.id };
        this.adminService.updateUserRoles(this.user.id, dto).subscribe(() => {
          if (this.user) {
            this.user.roles = updatedRoles;
            this.notificationService.show('Roles updated successfully.');
          }
        });
      }
    });
  }

  resetSecurityAttempts() {
    if (!this.user?.id) return;

    const data = {
      title: 'Confirm Reset',
      message: 'Are you sure you want to reset security question attempts for this user?',
      confirmText: 'Reset',
      cancelText: 'Cancel'
    };

    this.dialogService.confirm(data).subscribe((confirmed: boolean | undefined) => {
      if (!confirmed || !this.user) return;

      this.adminService.resetSecurityAttempts(this.user.id).subscribe({
        next: () => {
          if (this.user) {
            this.user.failedSecurityQuestionAttempts = 0;
            this.user.lockoutEndMinutesRemaining = undefined;
          }
          this.notificationService.show('Security question attempts reset successfully.');
        },
        error: () => {
          this.notificationService.show('Failed to reset attempts.', 'Close');
        }
      });
    });
  }

  backToAdminUsers() {
    this.router.navigate(['/admin/users']);
  }
}
