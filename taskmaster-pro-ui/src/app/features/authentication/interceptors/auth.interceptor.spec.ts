import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

// Mock Router
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('authInterceptor', () => {
  let router: RouterStub;

  beforeEach(() => {
    router = new RouterStub();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  function runInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    return TestBed.runInInjectionContext(() => authInterceptor(req, next));
  }

  it('should add Authorization header if token exists', (done) => {
    localStorage.setItem('jwt', 'test-token');

    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (r) => {
      expect(r.headers.get('Authorization')).toBe('Bearer test-token');
      return of({} as HttpEvent<any>);
    };

    runInterceptor(req, next).subscribe(() => done());
  });

  it('should not add Authorization header if no token', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (r) => {
      expect(r.headers.has('Authorization')).toBeFalse();
      return of({} as HttpEvent<any>);
    };

    runInterceptor(req, next).subscribe(() => done());
  });

  it('should remove token and navigate to /login on 401 error (non verify call)', (done) => {
    localStorage.setItem('jwt', 'test-token');
    const req = new HttpRequest('GET', '/api/protected');
    const next: HttpHandlerFn = () => throwError(() => ({ status: 401 }));

    runInterceptor(req, next).subscribe({
      error: () => {
        expect(localStorage.getItem('jwt')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });
  });

  it('should NOT navigate on 401 error if request is /verify-security-answer', (done) => {
    // arrange
    localStorage.setItem('jwt', 'test-token');

    // NOTE: pass a body (null) when using POST so TypeScript selects the correct overload
    const req = new HttpRequest('POST', '/api/verify-security-answer', null);

    const next: HttpHandlerFn = () => throwError(() => ({ status: 401 }));

    // run in injection context because the interceptor calls `inject(Router)`
    TestBed.runInInjectionContext(() => {
        authInterceptor(req, next).subscribe({
        error: () => {
            // assert - token should remain and no navigation should have happened
            expect(localStorage.getItem('jwt')).toBe('test-token');
            expect(router.navigate).not.toHaveBeenCalled();
            done();
        }
        });
    });
  });

  it('should keep token on successful response', (done) => {
    localStorage.setItem('jwt', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () => of({} as HttpEvent<any>);

    runInterceptor(req, next).subscribe(() => {
      expect(localStorage.getItem('jwt')).toBe('test-token');
      done();
    });
  });

  it('should pass through non-401 errors untouched', (done) => {
    localStorage.setItem('jwt', 'test-token');
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = { status: 500 };
    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    runInterceptor(req, next).subscribe({
      error: (err) => {
        expect(err).toBe(errorResponse);
        expect(localStorage.getItem('jwt')).toBe('test-token');
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
