import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './features/authentication/services/auth.service';

class MockAuthService {
  logoutIfExpired = jasmine.createSpy('logoutIfExpired');
}

describe('AppComponent', () => {
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call logoutIfExpired on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // triggers ngOnInit
    expect(authService.logoutIfExpired).toHaveBeenCalled();
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
