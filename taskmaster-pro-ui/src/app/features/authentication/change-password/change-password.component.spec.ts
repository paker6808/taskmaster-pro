import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

class MockAuthService {
  changePassword = jasmine.createSpy('changePassword').and.returnValue(of({}));
}
class MockNotificationService {
  show = jasmine.createSpy('show');
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: MockAuthService;
  let notification: MockNotificationService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ChangePasswordComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    notification = TestBed.inject(NotificationService) as unknown as MockNotificationService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
    authService.changePassword.calls.reset();
    notification.show.calls.reset();
    router.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.changePasswordForm).toBeTruthy();
    expect(component.newPassword).toBeTruthy();
  });

  it('should calculate password strength correctly', () => {
    expect(component.calculatePasswordStrength('')).toBe(0);
    expect(component.calculatePasswordStrength('abc')).toBeGreaterThan(0);
    expect(component.calculatePasswordStrength('Abc123!@#')).toBeGreaterThan(50);
  });

  it('should update password strength label when new password changes', () => {
    component.ngOnInit();
    component.newPassword.setValue('abc');
    expect(component.passwordStrengthLabel).toBe('Weak');
    component.newPassword.setValue('Abc12345');
    expect(['Medium', 'Strong', 'Very Strong']).toContain(component.passwordStrengthLabel);
  });

  it('should not submit if form invalid', () => {
    component.changePasswordForm.setValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
    component.onSubmit();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('should call authService.changePassword and navigate on success', fakeAsync(() => {
      component.changePasswordForm.setValue({ currentPassword: 'old', newPassword: 'Newpass1', confirmPassword: 'Newpass1' });
      component.onSubmit();
      tick();
      expect(authService.changePassword).toHaveBeenCalled();
      expect(notification.show).toHaveBeenCalledWith('Password changed successfully.');
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    })
  );

  it('should handle CurrentPasswordIncorrect error', () => {
    authService.changePassword.and.returnValue(throwError(() => ({ code: 'CurrentPasswordIncorrect' })));
    component.changePasswordForm.setValue({ currentPassword: 'bad', newPassword: 'Newpass1', confirmPassword: 'Newpass1' });
    component.onSubmit();
    expect(component.currentPassword.errors).toEqual({ incorrect: true });
  });

  it('should handle generic error', () => {
    authService.changePassword.and.returnValue(throwError(() => ({ code: 'OtherError' })));
    component.changePasswordForm.setValue({ currentPassword: 'bad', newPassword: 'Newpass1', confirmPassword: 'Newpass1' });
    component.onSubmit();
    expect(notification.show).toHaveBeenCalledWith('Password change failed.', 'Close');
  });

  it('should navigate to profile when goToProfile is called', () => {
    component.goToProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should set mismatch error when passwords do not match', () => {
    component.changePasswordForm.setValue({ currentPassword: 'old', newPassword: 'Newpass1', confirmPassword: 'Wrongpass' });
    component.onSubmit();
    expect(component.confirmPassword.errors).toEqual({ mismatch: true });
  });
});
