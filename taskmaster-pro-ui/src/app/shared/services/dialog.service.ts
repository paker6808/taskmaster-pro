import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean | undefined> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data
    });
    return ref.afterClosed();
  }

  open<T, R = unknown>(
    component: any,
    config?: MatDialogConfig<T>
  ): Observable<R | undefined> {
    const ref = this.dialog.open<R, T>(component, config as MatDialogConfig<T>);
    return ref.afterClosed();
  }
}