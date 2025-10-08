import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

class MockAuthService {
  confirmEmail = jasmine.createSpy('confirmEmail');
}

class MockNotificationService {
  show = jasmine.createSpy('show');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('EmailConfirmationComponent', () => {
  let component: EmailConfirmationComponent;
  let fixture: ComponentFixture<EmailConfirmationComponent>;
  let authService: MockAuthService;
  let notification: MockNotificationService;
  let router: MockRouter;

  function setupRoute(userId: string | null, token: string | null) {
    return {
      snapshot: {
        queryParamMap: {
          get: (key: string) => {
            if (key === 'userId') return userId;
            if (key === 'token') return token;
            return null;
          }
        }
      }
    } as unknown as ActivatedRoute;
  }

  beforeEach(async () => {
    authService = new MockAuthService();
    notification = new MockNotificationService();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [EmailConfirmationComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notification },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: setupRoute('user123', 'token123') }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirmEmail when query params exist and set success message', () => {
    authService.confirmEmail.and.returnValue(of({}));

    component.ngOnInit();

    expect(authService.confirmEmail).toHaveBeenCalledWith({ userId: 'user123', token: 'token123' });
    expect(component.message).toContain('successfully confirmed');
    expect(component.success).toBeTrue();
  });

  it('should set error message when confirmEmail fails', () => {
    authService.confirmEmail.and.returnValue(throwError(() => new Error('Server error')));

    component.ngOnInit();

    expect(component.message).toBe('Server error');
    expect(component.success).toBeFalse();
  });

  it('should use default error message when confirmEmail throws without message', () => {
    authService.confirmEmail.and.returnValue(throwError(() => ({ })));

    component.ngOnInit();

    expect(component.message).toBe('Email confirmation failed.');
    expect(component.success).toBeFalse();
  });

  it('should notify when query params are missing', () => {
  const invalidRoute = setupRoute(null, null);

  (component as any).route = invalidRoute;

  component.ngOnInit();

  expect(notification.show).toHaveBeenCalledWith('Invalid confirmation link.');
  expect(authService.confirmEmail).not.toHaveBeenCalled();
});


  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
