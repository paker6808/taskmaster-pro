import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open with default values when only message provided', () => {
    const message = 'Default test';
    service.show(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', { duration: 3000 });
    expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
  });

  it('should call snackBar.open with custom action and duration', () => {
    const message = 'Custom test';
    const action = 'Undo';
    const duration = 5000;
    service.show(message, action, duration);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, { duration });
  });

  it('should treat explicit undefined for optional params as defaults (JS behavior)', () => {
    const message = 'Undefined params';
    // pass undefined explicitly to mimic runtime JS calls
    service.show(message, undefined as any, undefined as any);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', { duration: 3000 });
  });

  it('should handle empty string message (should still call MatSnackBar.open)', () => {
    const message = '';
    service.show(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', { duration: 3000 });
  });

  it('should allow multiple sequential notifications (calls count + last args)', () => {
    service.show('first');
    service.show('second', 'Got it', 1000);

    expect(snackBarSpy.open).toHaveBeenCalledTimes(2);
    expect(snackBarSpy.open).toHaveBeenCalledWith('first', 'Close', { duration: 3000 });
    expect(snackBarSpy.open).toHaveBeenCalledWith('second', 'Got it', { duration: 1000 });
  });

  it('should not throw if MatSnackBar.open returns anything (defensive)', () => {
    // simulate snackBar.open returning an object (MatSnackBarRef)
    snackBarSpy.open.and.returnValue({} as any);
    expect(() => service.show('no throw')).not.toThrow();
    expect(snackBarSpy.open).toHaveBeenCalled();
  });
});
