import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StartComponent } from './start.component';
import { SecurityQuestionService } from '../../services/security-question.service';
import { NotificationService } from '../../../../shared/services/notification.service';

class MockSecurityQuestionService {
  getUserEmail = jasmine.createSpy('getUserEmail').and.returnValue('');
  getSecurityQuestion = jasmine.createSpy('getSecurityQuestion').and.returnValue(of({ securityQuestion: 'What?', sessionToken: 'abc' }));
  setQuestionLoaded = jasmine.createSpy('setQuestionLoaded');
  setUserEmail = jasmine.createSpy('setUserEmail');
  clear = jasmine.createSpy('clear');
}

class MockNotificationService {
  show = jasmine.createSpy('show');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;
  let mockService: MockSecurityQuestionService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockService = new MockSecurityQuestionService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, StartComponent],
      providers: [
        { provide: SecurityQuestionService, useValue: mockService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form invalid', () => {
    component.emailForm.setValue({ email: '' });
    component.loadQuestion();
    expect(mockService.getSecurityQuestion).not.toHaveBeenCalled();
  });

  it('should not submit if recaptcha missing', () => {
    component.emailForm.setValue({ email: 'test@example.com' });
    component.recaptchaToken = '';
    component.loadQuestion();
    expect(component.recaptchaError).toBeTrue();
  });

  it('should navigate to answer on success', () => {
    component.emailForm.setValue({ email: 'test@example.com' });
    component.recaptchaToken = 'validToken';
    component.loadQuestion();
    expect(mockService.getSecurityQuestion).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/security-question/answer'], jasmine.any(Object));
  });

  it('should show error on failure', () => {
    mockService.getSecurityQuestion.and.returnValue(throwError(() => ({ status: 400, error: { error: 'Invalid input' } })));
    component.emailForm.setValue({ email: 'test@example.com' });
    component.recaptchaToken = 'validToken';
    component.loadQuestion();
    expect(component.recaptchaError).toBeTrue();
  });

  it('should set captcha resolved when resolved', () => {
    component.onCaptchaResolved('abc');
    expect(component.recaptchaToken).toBe('abc');
    expect(component.captchaResolved).toBeTrue();
  });

  it('should set captcha error when expired', () => {
    component.onCaptchaExpired();
    expect(component.captchaResolved).toBeFalse();
    expect(component.recaptchaError).toBeTrue();
  });

  it('should reset captcha when called', () => {
    component.captchaResolved = true;
    component.recaptchaToken = 'abc';
    component.resetCaptcha();
    expect(component.captchaResolved).toBeFalse();
    expect(component.recaptchaToken).toBe('');
  });

  it('should clear service and navigate on cancel', () => {
    component.cancel();
    expect(mockService.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });
});
