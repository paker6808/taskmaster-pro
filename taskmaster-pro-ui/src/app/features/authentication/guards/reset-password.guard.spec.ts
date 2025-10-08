import { TestBed } from '@angular/core/testing';
import { ResetPasswordGuard } from './reset-password.guard';
import { Router, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        ResetPasswordGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(ResetPasswordGuard);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  function createSnapshot(token?: string, email?: string): ActivatedRouteSnapshot {
    return {
      queryParamMap: {
        get: (key: string) => {
          if (key === 'token') return token ?? null;
          if (key === 'email') return email ?? null;
          return null;
        }
      }
    } as any;
  }

  it('should allow activation when token and email are present and non-empty', () => {
    const snapshot = createSnapshot('abc', 'a@b.com');
    expect(guard.canActivate(snapshot)).toBeTrue();
  });

  it('should redirect when token is missing', () => {
    const tree = new UrlTree();
    router.createUrlTree.and.returnValue(tree);

    const snapshot = createSnapshot(undefined, 'a@b.com');
    expect(guard.canActivate(snapshot)).toBe(tree);
  });

  it('should redirect when email is missing', () => {
    const tree = new UrlTree();
    router.createUrlTree.and.returnValue(tree);

    const snapshot = createSnapshot('abc', undefined);
    expect(guard.canActivate(snapshot)).toBe(tree);
  });

  it('should redirect when token is empty string', () => {
    const tree = new UrlTree();
    router.createUrlTree.and.returnValue(tree);

    const snapshot = createSnapshot('', 'a@b.com');
    expect(guard.canActivate(snapshot)).toBe(tree);
  });

  it('should redirect when email is empty string', () => {
    const tree = new UrlTree();
    router.createUrlTree.and.returnValue(tree);

    const snapshot = createSnapshot('abc', '');
    expect(guard.canActivate(snapshot)).toBe(tree);
  });
});
