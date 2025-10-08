import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

describe('LoginComponent (RouterTestingModule)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let notifySpy: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    notifySpy = jasmine.createSpyObj('NotificationService', ['show']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notifySpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the loginForm with controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.submit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate on success', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: '12345678' });
    authSpy.login.and.returnValue(of({ token: 'abc' } as any));

    component.submit();
    tick();

    expect(authSpy.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '12345678' });
    expect(notifySpy.show).toHaveBeenCalledWith('Login successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show email-not-confirmed notification when login throws EmailNotConfirmed', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: '12345678' });
    authSpy.login.and.returnValue(throwError(() => new Error('EmailNotConfirmed')));

    component.submit();
    tick();

    expect(notifySpy.show).toHaveBeenCalledWith("Your email isn't confirmed yet. Check your inbox.", 'Close');
  }));

  it('should show invalid credentials on generic error', fakeAsync(() => {
    component.loginForm.setValue({ email: 'test@test.com', password: '12345678' });
    authSpy.login.and.returnValue(throwError(() => new Error('OtherError')));

    component.submit();
    tick();

    expect(notifySpy.show).toHaveBeenCalledWith('Invalid credentials', 'Close');
  }));
});
