import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterDto } from '../models/register.dto';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

class MockAuthService {
  register = jasmine.createSpy('register');
}

class MockNotificationService {
  show = jasmine.createSpy('show');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

const registerMock : RegisterDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  securityQuestion: 'What was your childhood nickname?',
  securityAnswer: 'Johnny',
  recaptchaToken: 'token'
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let notification: MockNotificationService;
  let router: MockRouter;

  beforeEach(async () => {
    authService = new MockAuthService();
    notification = new MockNotificationService();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule, MaterialModule, RecaptchaModule, RecaptchaFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notification },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all form controls', () => {
    const controls = component.registerForm.controls;
    expect(controls['firstName']).toBeTruthy();
    expect(controls['lastName']).toBeTruthy();
    expect(controls['email']).toBeTruthy();
    expect(controls['password']).toBeTruthy();
    expect(controls['confirmPassword']).toBeTruthy();
    expect(controls['securityQuestion']).toBeTruthy();
    expect(controls['securityAnswer']).toBeTruthy();
    expect(controls['recaptchaToken']).toBeTruthy();
  });

  it('should not submit invalid form', () => {
    component.registerForm.setValue({
      firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
      securityQuestion: '', securityAnswer: '', recaptchaToken: ''
    });
    component.submit();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should calculate password strength correctly', () => {
    const pw = 'Password1!';
    const strength = component.calculatePasswordStrength(pw);
    expect(strength).toBe(100);
  });

  it('should submit valid form and show success notification', () => {
    component.registerForm.setValue(registerMock);
    authService.register.and.returnValue(of(void 0));

    component.submit();

    expect(authService.register).toHaveBeenCalledWith(registerMock);
    expect(notification.show).toHaveBeenCalledWith('Registration successful. Please check your email to confirm your account.');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error notification on register failure', () => {
    component.registerForm.setValue(registerMock);
    authService.register.and.returnValue(throwError(() => new Error('Fail')));

    component.submit();

    expect(authService.register).toHaveBeenCalled();
    expect(notification.show).toHaveBeenCalledWith('Registration failed', 'Close');
  });

  it('should navigate to login on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update recaptcha control on captcha resolved', () => {
    component.onCaptchaResolved('token');
    expect(component.recaptcha.value).toBe('token');

    component.onCaptchaResolved(null);
    expect(component.recaptcha.value).toBe('');
  });
});
