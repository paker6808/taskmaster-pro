import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScheduleDetailComponent } from './schedule-detail.component';
import { ScheduleService } from '../../../core/services/schedule.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { scheduleDetailMock, scheduleMock } from '../../../shared/mock-data';

describe('ScheduleDetailComponent', () => {
  let component: ScheduleDetailComponent;
  let fixture: any;
  let scheduleServiceSpy: any;
  let notificationSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;
  
  beforeEach(() => {
    scheduleServiceSpy = {
      getById: jasmine.createSpy('getById').and.returnValue(of(scheduleMock))
    };
    notificationSpy = { show: jasmine.createSpy('show') };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);

    TestBed.configureTestingModule({
      imports: [ScheduleDetailComponent, CommonModule, MaterialModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: ScheduleService, useValue: scheduleServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Clipboard, useValue: clipboardSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'abc' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load schedule on init', fakeAsync(() => {
    scheduleServiceSpy.getById.and.returnValue(of(scheduleDetailMock));
    component.ngOnInit();
    tick();

    expect(scheduleServiceSpy.getById).toHaveBeenCalledWith('abc');
    expect(component.schedule).toEqual(scheduleDetailMock);
  }));

  it('should handle error when loading schedule', fakeAsync(() => {
    scheduleServiceSpy.getById.and.returnValue(throwError(() => new Error('API error')));
    component.loadSchedule('abc');
    tick();

    expect(component.schedule).toBeNull();
  }));

  it('should copy schedule id to clipboard', () => {
    component.schedule = scheduleDetailMock;
    component.copyId();

    expect(clipboardSpy.copy).toHaveBeenCalledWith(scheduleDetailMock.id);
    expect(notificationSpy.show).toHaveBeenCalledWith('Schedule ID copied to clipboard');
  });

  it('should not copy if schedule id is null', () => {
    component.schedule = { id: '', title: 'Test' } as any;
    component.copyId();

    expect(clipboardSpy.copy).not.toHaveBeenCalled();
    expect(notificationSpy.show).not.toHaveBeenCalled();
  });

  it('should navigate back to schedules', () => {
    component.backToSchedules();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/schedules']);
  });
});
