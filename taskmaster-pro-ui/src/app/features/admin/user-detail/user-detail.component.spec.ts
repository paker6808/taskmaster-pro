import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { DialogService } from '../../../shared/services/dialog.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { userDetailMock } from '../../../shared/mock-data';

describe('UserDetailComponent', () => {
  let fixture: any;
  let component: UserDetailComponent;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;
  let activatedRouteStub: any;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    // Spies
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getUserById',
      'updateUserRoles',
      'resetSecurityAttempts'
    ]);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm', 'open']); 
    dialogServiceSpy.confirm.and.returnValue(of(true));
    dialogServiceSpy.open.and.returnValue(of(undefined));

    // Default activated route returns id 'u1'
    activatedRouteStub = { snapshot: { paramMap: { get: () => 'u1' } } };

    // Default spy returns full user
    adminServiceSpy.getUserById.and.returnValue(of(userDetailMock));
    adminServiceSpy.updateUserRoles.and.returnValue(of(void 0));
    adminServiceSpy.resetSecurityAttempts.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [UserDetailComponent, CommonModule, MaterialModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Clipboard, useValue: clipboardSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DialogService,  useValue: dialogServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', fakeAsync(() => {
    expect(adminServiceSpy.getUserById).toHaveBeenCalledWith('u1');
    expect(component.user).toEqual(userDetailMock);
  }));

  it('should notify when no id provided', () => {
    // Arrange: change route to return null
    (TestBed.inject(ActivatedRoute) as any).snapshot.paramMap.get = () => null;

    // Reset spies so previous calls don't confuse expectations
    adminServiceSpy.getUserById.calls.reset();
    notificationSpy.show.calls.reset();

    // Act
    component.ngOnInit();

    // Assert
    expect(adminServiceSpy.getUserById).not.toHaveBeenCalled();
    expect(notificationSpy.show).toHaveBeenCalledWith('User ID not provided.', 'Close');
  });

  it('should copy user id to clipboard and notify', () => {
    component.user = userDetailMock;
    component.copyId();

    expect(clipboardSpy.copy).toHaveBeenCalledWith(userDetailMock.id);
    expect(notificationSpy.show).toHaveBeenCalledWith('User ID copied to clipboard');
  });

  it('should not copy if no user id', () => {
    component.user = { id: '' } as any;
    component.copyId();

    expect(clipboardSpy.copy).not.toHaveBeenCalled();
    expect(notificationSpy.show).not.toHaveBeenCalled();
  });

  it('should open edit roles dialog and update roles when confirmed', fakeAsync(() => {
    component.user = userDetailMock;
    adminServiceSpy.updateUserRoles.and.returnValue(of(void 0));
    dialogServiceSpy.open.and.returnValue(of(['User']));

    component.openEditRoles();
    tick();

    expect(adminServiceSpy.updateUserRoles).toHaveBeenCalledWith(
      'user1', 
      { roles: ['User'], userId: 'user1' }
    );
    expect(notificationSpy.show).toHaveBeenCalledWith('Roles updated successfully.');
  }));

  it('should not call updateUserRoles if dialog closed without roles', fakeAsync(() => {
    component.user = { ...userDetailMock, roles: [] } as any;

    dialogServiceSpy.open.and.returnValue(of(undefined));
    component.openEditRoles();
    tick();

    expect(adminServiceSpy.updateUserRoles).not.toHaveBeenCalled();
  }));

  it('should reset security attempts successfully', fakeAsync(() => {
    adminServiceSpy.resetSecurityAttempts.and.returnValue(of(void 0));
    component.user = { ...userDetailMock, failedSecurityQuestionAttempts: 3 } as any;

    component.resetSecurityAttempts();
    tick();

    expect(adminServiceSpy.resetSecurityAttempts).toHaveBeenCalledWith(component.user!.id);
    expect(component.user!.failedSecurityQuestionAttempts).toBe(0);
    expect(notificationSpy.show).toHaveBeenCalledWith('Security question attempts reset successfully.');
  }));

  it('should notify on reset security attempts error', fakeAsync(() => {
    adminServiceSpy.resetSecurityAttempts.and.returnValue(throwError(() => new Error('err')));
    component.user = { ...userDetailMock, failedSecurityQuestionAttempts: 3 } as any;

    component.resetSecurityAttempts();
    tick();

    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to reset attempts.', 'Close');
  }));

  it('should navigate back to users', () => {
    component.backToAdminUsers();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/users']);
  });
});
