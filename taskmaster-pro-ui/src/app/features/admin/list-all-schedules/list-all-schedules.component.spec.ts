import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListAllSchedulesComponent } from './list-all-schedules.component';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_PAGE_SIZE_OPTIONS , PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';
import { pagedSchedulesMock, scheduleMock } from '../../../shared/mock-data';

describe('ListAllSchedulesComponent', () => {
  let component: ListAllSchedulesComponent;
  let fixture: any;
  let adminServiceSpy: any;
  let notificationSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let exportServiceSpy: any;

  beforeEach(() => {
    adminServiceSpy = {
      getPagedSchedules: jasmine.createSpy('getPagedSchedules').and.returnValue(of({ data: [], draw: 1, recordsTotal: 0 })),
      deleteSchedule: jasmine.createSpy('deleteSchedule').and.returnValue(of(void 0))
    };
    notificationSpy = { show: jasmine.createSpy('show') };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
    dialogServiceSpy.confirm.and.returnValue(of(true));

    
    // ExportService spy
    exportServiceSpy = jasmine.createSpyObj('ExportService', ['exportToExcel', 'exportToCSV']);

    TestBed.configureTestingModule({
      imports: [ListAllSchedulesComponent, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: PAGE_SIZE_OPTIONS, useValue: DEFAULT_PAGE_SIZE_OPTIONS },
        { provide: 'ExportService', useValue: exportServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAllSchedulesComponent);
    component = fixture.componentInstance;

    // Ensure component uses the spy (covers cases where DI token differs)
    (component as any).exportService = exportServiceSpy;

    fixture.detectChanges(); // triggers ngOnInit -> loadPage()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load schedules on init', fakeAsync(() => {
    const mockData = pagedSchedulesMock;
    adminServiceSpy.getPagedSchedules.and.returnValue(of(mockData));

    component['loadPage'](); // private method, can call inside test
    tick();

    expect(component.schedules.length).toBe(pagedSchedulesMock.data.length);
    expect(component.totalRecords).toBe(pagedSchedulesMock.recordsTotal);
  }));

  it('should handle error when loading schedules', fakeAsync(() => {
    adminServiceSpy.getPagedSchedules.and.returnValue(throwError(() => new Error('API error')));

    component['loadPage']();
    tick();

    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to load schedules.', 'Close');
  }));

  it('should navigate to view schedule', () => {
    component.viewSchedule('42');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/schedules', '42']);
  });

  it('should delete schedule when confirmed', fakeAsync(() => {
    component.deleteSchedule('1');
    tick();

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(adminServiceSpy.deleteSchedule).toHaveBeenCalledWith('1');
    expect(notificationSpy.show).toHaveBeenCalledWith('Schedule deleted successfully.');
  }));

  it('should handle page change', fakeAsync(() => {
    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100 } as any);
    tick();

    expect(component.pageIndex).toBe(2);
    expect(component.pageSize).toBe(20);
    expect(adminServiceSpy.getPagedSchedules).toHaveBeenCalled();
  }));

  it('should handle sort change', fakeAsync(() => {
    component.onSortChange({ active: 'title', direction: 'desc' } as any);
    tick();

    expect(component.sortColumn).toBe(component.displayedColumns.indexOf('title'));
    expect(component.sortDirection).toBe('desc');
    expect(adminServiceSpy.getPagedSchedules).toHaveBeenCalled();
  }));

  it('should export all schedules to Excel', fakeAsync(() => {
    const allSchedules = [
      {
        ...scheduleMock,
        assignedTo: scheduleMock.assignedTo?.displayName ?? scheduleMock.assignedTo?.id ?? ''
      }
    ];

    // Component should know there are records to fetch
    component.totalRecords = allSchedules.length;
    
    // When fetchAllSchedulesForExport calls adminService.getPagedSchedules, return the full dataset
    adminServiceSpy.getPagedSchedules.and.returnValue(of({ data: allSchedules, draw: 1, recordsTotal: allSchedules.length }));

    component.exportSchedulesExcel();
    tick();

    expect(adminServiceSpy.getPagedSchedules).toHaveBeenCalled();
    expect(exportServiceSpy.exportToExcel).toHaveBeenCalledWith(allSchedules, 'Schedules', component.headerMap);
  }));

  it('should export all schedules to CSV', fakeAsync(() => {
    const allSchedules = [
      {
        ...scheduleMock,
        assignedTo: scheduleMock.assignedTo?.displayName ?? scheduleMock.assignedTo?.id ?? ''
      }
    ];

    component.totalRecords = allSchedules.length;
    adminServiceSpy.getPagedSchedules.and.returnValue(of({ data: allSchedules, draw: 1, recordsTotal: allSchedules.length }));

    component.exportSchedulesCSV();
    tick();

    expect(adminServiceSpy.getPagedSchedules).toHaveBeenCalled();
    expect(exportServiceSpy.exportToCSV).toHaveBeenCalledWith(
      allSchedules,
      'Schedules',
      component.headerMap
    );
  }));

  it('should show notification when no schedules to export', () => {
    component.totalRecords = 0;
    component.exportSchedulesExcel();
    expect(notificationSpy.show).toHaveBeenCalledWith('No schedules to export.', 'Close');
  });
});
