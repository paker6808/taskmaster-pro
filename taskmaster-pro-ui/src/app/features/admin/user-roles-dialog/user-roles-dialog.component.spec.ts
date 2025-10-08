import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserRolesDialogComponent } from './user-roles-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';

describe('UserRolesDialogComponent', () => {
  let component: UserRolesDialogComponent;
  let fixture: ComponentFixture<UserRolesDialogComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const dialogData = {
    userId: 'u1',
    currentRoles: ['User'],
    availableRoles: ['Admin', 'User']
  };

  beforeEach(async () => {
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['changeUserRoles', 'updateUserRoles']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);

    await TestBed.configureTestingModule({
      imports: [UserRolesDialogComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize rolesControl with injected currentRoles', () => {
    expect(component.rolesControl.value).toEqual(['User']);
    expect(component.rolesControl.valid).toBeTrue(); // has 1 selected -> minSelected passes
  });

  it('allRoles should return provided availableRoles', () => {
    expect(component.allRoles).toEqual(['Admin', 'User']);
  });

  it('onSave should close the dialog with selected roles when valid', () => {
    const dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserRolesDialogComponent>>;
    
    component.rolesControl.setValue(['Admin', 'User']);
    component.onSave();
    
    expect(dialogRefSpy.close).toHaveBeenCalledWith(['Admin', 'User']);
  });

  it('onSave should NOT call dialogService.open() when rolesControl is invalid (empty) and should mark touched', fakeAsync(() => {
    // Set value to an empty array -> invalid (minSelected(1))
    component.rolesControl.setValue([]);
    expect(component.rolesControl.invalid).toBeTrue();

    // Reset spy call history just in case
    dialogServiceSpy.open.calls.reset();

    component.onSave();
    tick();

    expect(component.rolesControl.touched).toBeTrue();
    expect(dialogServiceSpy.open).not.toHaveBeenCalled();
  }));

  it('onCancel should close the dialog with null', () => {
    const dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserRolesDialogComponent>>;

    component.onCancel();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });
});
