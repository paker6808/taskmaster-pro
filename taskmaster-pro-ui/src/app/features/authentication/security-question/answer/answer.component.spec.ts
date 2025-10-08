import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AnswerComponent } from './answer.component';
import { VerifySecurityAnswerDto } from '../../models/verify-security-answer.dto';
import { SecurityQuestionService } from '../../services/security-question.service';
import { NotificationService } from '../../../../shared/services/notification.service';

class MockSecurityQuestionService {
  getUserEmail = jasmine.createSpy().and.returnValue('test@example.com');
  getSecurityQuestion = jasmine.createSpy().and.returnValue(of({ securityQuestion: 'Test question?' }));
  verifySecurityAnswer = jasmine.createSpy().and.returnValue(of({ token: 'abc123', email: 'test@example.com' }));
}

class MockNotificationService {
  show = jasmine.createSpy();
}

class MockRouter {
  navigate = jasmine.createSpy();
}

const verifySecurityAnswerMock: VerifySecurityAnswerDto = {
  email: 'test@example.com',
  securityAnswer: 'MyAnswer',
  recaptchaToken: 'valid-token',
  sessionToken: 'session123'
};

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let service: MockSecurityQuestionService;
  let notification: MockNotificationService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AnswerComponent],
      providers: [
        { provide: SecurityQuestionService, useClass: MockSecurityQuestionService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: new Map() } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SecurityQuestionService) as unknown as MockSecurityQuestionService;
    notification = TestBed.inject(NotificationService) as unknown as MockNotificationService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.answerForm.setValue({ securityAnswer: '' });
    component.recaptchaToken = 'valid-token';
    component.submitAnswer();
    expect(service.verifySecurityAnswer).not.toHaveBeenCalled();
  });

  it('should set recaptchaError if no recaptcha token', () => {
    component.answerForm.setValue({ securityAnswer: 'MyAnswer' });
    component.recaptchaToken = '';
    component.submitAnswer();
    expect(component.recaptchaError).toBeTrue();
    expect(service.verifySecurityAnswer).not.toHaveBeenCalled();
  });

  it('should call verifySecurityAnswer with correct dto', () => {
    component.answerForm.setValue({ securityAnswer: 'MyAnswer' });
    component.recaptchaToken = 'valid-token';
    component.emailToUse = 'test@example.com';
    component.sessionToken = 'session123';

    component.submitAnswer();

    expect(service.verifySecurityAnswer).toHaveBeenCalledWith(verifySecurityAnswerMock);
  });

  it('should navigate to reset-password on success', () => {
    component.answerForm.setValue({ securityAnswer: 'MyAnswer' });
    component.recaptchaToken = 'valid-token';

    component.submitAnswer();

    expect(router.navigate).toHaveBeenCalledWith(['/reset-password'], { queryParams: { token: 'abc123', email: 'test@example.com' } });
  });

  it('should show error notification on error', fakeAsync(() => {
    service.verifySecurityAnswer.and.returnValue(throwError(() => ({ status: 401, error: 'Incorrect answer' })));

    component.answerForm.setValue({ securityAnswer: 'WrongAnswer' });
    component.recaptchaToken = 'valid-token';

    component.submitAnswer();
    tick();

    expect(notification.show).toHaveBeenCalledWith('Incorrect answer', 'Close');
  }));

  it('should go back to start', () => {
    component.emailToUse = 'test@example.com';
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/security-question/start'], { queryParams: { email: 'test@example.com' } });
  });
});
