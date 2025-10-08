import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      isAdmin$: new BehaviorSubject<boolean>(false)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if user is admin', (done) => {
    (authService.isAdmin$ as BehaviorSubject<boolean>).next(true);
    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect if user is not admin', (done) => {
    const tree = {} as UrlTree;
    router.createUrlTree.and.returnValue(tree);
    (authService.isAdmin$ as BehaviorSubject<boolean>).next(false);

    guard.canActivate().subscribe(result => {
      expect(result).toBe(tree);
      done();
    });
  });

  it('should only take the first emitted value', (done) => {
    const emitted: boolean[] = [];
    guard.canActivate().subscribe(result => {
      emitted.push(result === true);
    });

    const subj = authService.isAdmin$ as BehaviorSubject<boolean>;
    subj.next(true);
    subj.next(false); // should be ignored by first()

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toBe(false); // initial BehaviorSubject value
    done();
  });

  it('should handle observable errors gracefully', (done) => {
    Object.defineProperty(authService, 'isAdmin$', {
      value: throwError(() => new Error('unexpected')),
      configurable: true
    });

    guard.canActivate().subscribe({
      next: result => {
        expect(router.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
        done();
      },
      error: () => done.fail('Guard should not throw on inner observable error')
    });
  });
});
