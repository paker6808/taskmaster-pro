import { TestBed } from '@angular/core/testing';
import { SecurityQuestionGuard } from './security-question.guard';
import { SecurityQuestionService } from '../services/security-question.service';
import { Router } from '@angular/router';

describe('SecurityQuestionGuard', () => {
  let guard: SecurityQuestionGuard;
  let securityService: jasmine.SpyObj<SecurityQuestionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const securitySpy = jasmine.createSpyObj('SecurityQuestionService', ['isQuestionLoaded']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        SecurityQuestionGuard,
        { provide: SecurityQuestionService, useValue: securitySpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(SecurityQuestionGuard);
    securityService = TestBed.inject(SecurityQuestionService) as jasmine.SpyObj<SecurityQuestionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when question is loaded', () => {
    securityService.isQuestionLoaded.and.returnValue(true);

    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /forgot-password when question is not loaded', () => {
    securityService.isQuestionLoaded.and.returnValue(false);

    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });

  it('should handle unexpected errors in service gracefully', () => {
    (securityService.isQuestionLoaded as jasmine.Spy).and.callFake(() => {
      throw new Error('Unexpected');
    });

    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });

  it('should consistently return a boolean even if service misbehaves', () => {
    (securityService.isQuestionLoaded as jasmine.Spy).and.returnValue(null as any);

    const result = guard.canActivate();
    expect(typeof result).toBe('boolean');
  });
});
