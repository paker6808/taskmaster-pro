import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn$: new BehaviorSubject<boolean>(false)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.callFake(() => new UrlTree());

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if user is logged in', (done) => {
    (authService.isLoggedIn$ as BehaviorSubject<boolean>).next(true);
    guard.canActivate({} as any, { url: '/test' } as any).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to /login with returnUrl if not logged in', (done) => {
    const tree = new UrlTree();
    router.createUrlTree.and.returnValue(tree);
    (authService.isLoggedIn$ as BehaviorSubject<boolean>).next(false);

    guard.canActivate({} as any, { url: '/dashboard' } as any).subscribe(result => {
      expect(result).toBe(tree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
      done();
    });
  });

  it('should only take the first emitted value', (done) => {
    const subj = new BehaviorSubject<boolean>(false);
    Object.defineProperty(authService, 'isLoggedIn$', { get: () => subj });

    let firstEmitted: boolean | null = null;

    guard.canActivate({} as any, { url: '/test' } as any).subscribe(result => {
        firstEmitted = result === true;
    });

    subj.next(true);  // ignored by guard because of first()
    subj.next(false); // ignored

    setTimeout(() => {
        expect(firstEmitted).toBe(false); // only first emission counts
        done();
    }, 10);
  });


  it('should handle observable errors gracefully', (done) => {
    // Mock isLoggedIn$ to throw an error
    Object.defineProperty(authService, 'isLoggedIn$', {
        get: () => throwError(() => new Error('unexpected'))
    });

    // Spy on router.createUrlTree to capture redirection
    const urlTree = new UrlTree();
    router.createUrlTree.and.returnValue(urlTree);

    guard.canActivate({} as any, { url: '/test' } as any).subscribe({
        next: result => {
        // Expect the guard to redirect when observable errors
        expect(result).toBe(urlTree);
        done();
        },
        error: () => done.fail('Guard should not throw on inner observable error')
    });
  });
});
