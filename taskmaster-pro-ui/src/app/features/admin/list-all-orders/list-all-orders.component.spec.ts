import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListAllOrdersComponent } from './list-all-orders.component';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_PAGE_SIZE_OPTIONS , PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';
import { orderMock, pagedOrdersMock } from '../../../shared/mock-data';

describe('ListAllOrdersComponent', () => {
  let component: ListAllOrdersComponent;
  let fixture: any;
  let adminServiceSpy: any;
  let notificationSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let exportServiceSpy: any;

  beforeEach(() => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getPagedOrders', 'deleteOrder']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
    dialogServiceSpy.confirm.and.returnValue(of(true));

    // Default responses
    adminServiceSpy.getPagedOrders.and.returnValue(of({ data: [], draw: 1, recordsTotal: 0 }));
    adminServiceSpy.deleteOrder.and.returnValue(of(void 0));

    // ExportService spy
    exportServiceSpy = jasmine.createSpyObj('ExportService', ['exportToExcel', 'exportToCSV']);

    TestBed.configureTestingModule({
      imports: [ListAllOrdersComponent, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogServiceSpy  },
        { provide: PAGE_SIZE_OPTIONS, useValue: DEFAULT_PAGE_SIZE_OPTIONS },
        { provide: 'ExportService', useValue: exportServiceSpy },
        { provide: (window as any).ExportService, useValue: exportServiceSpy }
      ]
    }).compileComponents();

    // Create component
    fixture = TestBed.createComponent(ListAllOrdersComponent);
    component = fixture.componentInstance;

    // Ensure component uses the spy (covers cases where DI token differs)
    (component as any).exportService = exportServiceSpy;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('should load orders on init', fakeAsync(() => {
    adminServiceSpy.getPagedOrders.and.returnValue(of(pagedOrdersMock));

    fixture.detectChanges();
    tick();

    expect(component.orders.length).toBe(pagedOrdersMock.data.length);
    expect(component.totalRecords).toBe(pagedOrdersMock.data.length);
  }));

  it('should handle error when loading orders', fakeAsync(() => {
    adminServiceSpy.getPagedOrders.and.returnValue(throwError(() => new Error('API error')));

    fixture.detectChanges();
    tick();

    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to load orders.', 'Close');
  }));

  it('should navigate to view order', () => {
    component.viewOrder('42');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/orders', '42']);
  });

  it('should delete order when confirmed', fakeAsync(() => {
    component.deleteOrder('1');
    tick();

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(adminServiceSpy.deleteOrder).toHaveBeenCalledWith('1');
    expect(notificationSpy.show).toHaveBeenCalledWith('Order deleted successfully.');
  }));

  it('should copy order ID to clipboard', () => {
    const writeSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    component.copyId('123');
    expect(writeSpy).toHaveBeenCalledWith('123');
  });

  it('should navigate to create schedule with orderId', () => {
    component.createScheduleFor('456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/schedules/create'], { queryParams: { orderId: '456' } });
  });

  it('should handle page change', fakeAsync(() => {
    fixture.detectChanges();
    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100 } as any);
    tick();

    expect(component.pageIndex).toBe(2);
    expect(component.pageSize).toBe(20);
    expect(adminServiceSpy.getPagedOrders).toHaveBeenCalled();
  }));

  it('should handle sort change', fakeAsync(() => {
    fixture.detectChanges();
    component.onSortChange({ active: 'customerName', direction: 'desc' } as any);
    tick();

    expect(component.sortColumn).toBe(component.displayedColumns.indexOf('customerName'));
    expect(component.sortDirection).toBe('desc');
    expect(adminServiceSpy.getPagedOrders).toHaveBeenCalled();
  }));

  it('should export all orders to Excel', fakeAsync(() => {
    // Prepare full dataset that fetchAllOrdersForExport will return
    const allOrders = [orderMock];

    // Make sure component knows there are records to fetch
    component.totalRecords = allOrders.length;

    // When fetchAll schedules calls adminService.getPagedOrders, return full dataset
    adminServiceSpy.getPagedOrders.and.returnValue(of({ data: allOrders, draw: 1, recordsTotal: allOrders.length }));

    // Call export
    component.exportOrdersExcel();
    tick();

    expect(adminServiceSpy.getPagedOrders).toHaveBeenCalled();
    expect(exportServiceSpy.exportToExcel).toHaveBeenCalledWith(allOrders, 'Orders', component.headerMap);
  }));

  it('should export all orders to CSV', fakeAsync(() => {
    const allOrders = [orderMock];

    component.totalRecords = allOrders.length;
    adminServiceSpy.getPagedOrders.and.returnValue(of({ data: allOrders, draw: 1, recordsTotal: 1 }));

    component.exportOrdersCSV();
    tick();

    expect(adminServiceSpy.getPagedOrders).toHaveBeenCalled();
    expect(exportServiceSpy.exportToCSV).toHaveBeenCalledWith(allOrders, 'Orders', component.headerMap);
  }));

  it('should show notification when no orders to export', () => {
    component.totalRecords = 0;
    component.exportOrdersExcel();
    expect(notificationSpy.show).toHaveBeenCalledWith('No orders to export.', 'Close');
  });
});
