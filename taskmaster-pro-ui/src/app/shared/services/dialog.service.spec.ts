import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';
import { of } from 'rxjs';

describe('DialogService', () => {
  let service: DialogService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('confirm() should open ConfirmDialogComponent and return afterClosed observable', (done) => {
    const mockData: ConfirmDialogData = {
      title: 'Test Confirm',
      message: 'Are you sure?',
      confirmText: 'Yes',
      cancelText: 'No'
    };

    // fake afterClosed observable
    const afterClosed$ = of(true);
    matDialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);

    service.confirm(mockData).subscribe(result => {
      expect(result).toBeTrue();
      expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        width: '350px',
        data: mockData
      });
      done();
    });
  });

  it('confirm() should handle false result', (done) => {
    const mockData: ConfirmDialogData = {
      title: 'Cancel Test',
      message: 'Are you sure?',
      confirmText: 'Yes',
      cancelText: 'No'
    };

    const afterClosed$ = of(false);
    matDialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);

    service.confirm(mockData).subscribe(result => {
      expect(result).toBeFalse();
      expect(matDialogSpy.open).toHaveBeenCalled();
      done();
    });
  });
});
