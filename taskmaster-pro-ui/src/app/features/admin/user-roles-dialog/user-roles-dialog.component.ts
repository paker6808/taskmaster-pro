import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRolesDialogData } from '../models/user-roles-dialog-data';
import { minSelected } from '../../../shared/validators/min-selected.validator';

@Component({
  selector: 'app-user-roles-dialog',
  templateUrl: './user-roles-dialog.component.html',
  styleUrls: ['./user-roles-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class UserRolesDialogComponent {
  readonly availableRoles: string[] = ['Admin', 'User'];

  // Control holds an array of selected role names (mat-select multiple)
  rolesControl: FormControl<string[] | null>;

  constructor(
    private dialogRef: MatDialogRef<UserRolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRolesDialogData
  ) {
    this.rolesControl = new FormControl<string[] | null>(
      this.data?.currentRoles ?? [],
      { validators: [minSelected(1)] }
    );
  }

  onSave(): void {
    if (this.rolesControl.invalid) {
      this.rolesControl.markAsTouched();
      return;
    }

    const selectedRoles = this.rolesControl.value ?? [];
    this.dialogRef.close(selectedRoles);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
  
  // Roles getter used by the template
  get allRoles(): string[] {
     return this.data?.availableRoles ?? ['User', 'Admin'];
  }
}