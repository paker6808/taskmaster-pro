import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';
import { BehaviorSubject, Subject, firstValueFrom, of } from 'rxjs';
import { take } from 'rxjs/operators';

class MockRouter {
  url = '/';
  // Use a Subject so tests can emit router events without the real Router
  events = new Subject<any>();
  navigate = jasmine.createSpy('navigate');
  createUrlTree = jasmine.createSpy('createUrlTree');
}

class MockAuthService {
  isLoggedIn$ = of(true);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  logout = jasmine.createSpy('logout');
}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let router: MockRouter;
  let auth: MockAuthService;

  beforeEach(waitForAsync(async () => {
    router = new MockRouter();
    auth = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent], // standalone component
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth },
      ],
    })
      // Override template to avoid instantiating RouterLink/Material in tests
      .overrideComponent(MainLayoutComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav', () => {
    expect(component.isSidenavOpen).toBeFalse();
    component.toggleSidenav();
    expect(component.isSidenavOpen).toBeTrue();
    component.toggleSidenav();
    expect(component.isSidenavOpen).toBeFalse();
  });

  it('should navigate to profile', () => {
    component.goToProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should logout and redirect to login', () => {
    component.isSidenavOpen = true;
    component.logout();
    expect(auth.logout).toHaveBeenCalled();
    expect(component.isSidenavOpen).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should subscribe to isAdmin$', () => {
    expect(component.isAdmin).toBeFalse();
    auth.isAdmin$.next(true);
    expect(component.isAdmin).toBeTrue();
  });

  it('should detect admin route from router events', async () => {
    // start on non-admin route
    router.url = '/orders';
    router.events.next(new NavigationEnd(1, '/orders', '/orders'));

    let value = await firstValueFrom(component.isAdminRoute$.pipe(take(1)));
    expect(value).toBeFalse();

    // switch to an admin route and emit a new event
    router.url = '/admin/users';
    router.events.next(new NavigationEnd(2, '/admin/users', '/admin/users'));

    value = await firstValueFrom(component.isAdminRoute$.pipe(take(1)));
    expect(value).toBeTrue();
  });
});
