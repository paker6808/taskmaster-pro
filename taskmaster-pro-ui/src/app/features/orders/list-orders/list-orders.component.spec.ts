import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListOrdersComponent } from './list-orders.component';
import { Router } from '@angular/router';
import { ExportService } from '../../../shared/services/export.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../shared/services/dialog.service';
import { DEFAULT_PAGE_SIZE_OPTIONS , PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';
import { pagedOrdersMock } from '../../../shared/mock-data';

// Mocks
class MockExportService {
  exportToExcel = jasmine.createSpy('exportToExcel');
  exportToCSV = jasmine.createSpy('exportToCSV');
}

describe('ListOrdersComponent', () => {
  let fixture: ComponentFixture<ListOrdersComponent>;
  let component: ListOrdersComponent;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getPaged', 'delete']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);

    // Default paged orders
    orderServiceSpy.getPaged.and.returnValue(of(pagedOrdersMock));

    await TestBed.configureTestingModule({
      imports: [CommonModule, ListOrdersComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: PAGE_SIZE_OPTIONS, useValue: DEFAULT_PAGE_SIZE_OPTIONS },
        { provide: ExportService, useClass: MockExportService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load orders on init', () => {
    expect(orderServiceSpy.getPaged).toHaveBeenCalled();
    expect(component.orders.length).toBe(pagedOrdersMock.data.length);
    expect(component.totalRecords).toBe(pagedOrdersMock.data.length);
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate to create order page', () => {
    component.createOrder();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders/create']);
  });

  it('should navigate to edit order page', () => {
    component.editOrder('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders/edit', '123']);
  });

  it('should copy order ID to clipboard', () => {
    const writeSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    component.copyId('123');
    expect(writeSpy).toHaveBeenCalledWith('123');
  });

  it('should navigate to create schedule with orderId', () => {
    component.createScheduleFor('456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/schedules/create'], { queryParams: { orderId: '456' } });
  });

  it('should handle deleteOrder with confirmation', fakeAsync(() => {
    dialogServiceSpy.confirm.and.returnValue(of(true)); // user confirmed
    orderServiceSpy.delete.and.returnValue(of(void 0));

    component.deleteOrder('123');
    tick();

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(orderServiceSpy.delete).toHaveBeenCalledWith('123');
    expect(notificationSpy.show).toHaveBeenCalledWith('Order deleted successfully.');
  }));

  it('should not delete if confirmation is false', fakeAsync(() => {
    dialogServiceSpy.confirm.and.returnValue(of(false)); // user cancelled

    component.deleteOrder('123');
    tick();

    expect(dialogServiceSpy.confirm).toHaveBeenCalled();
    expect(orderServiceSpy.delete).not.toHaveBeenCalled();
    expect(notificationSpy.show).not.toHaveBeenCalled();
  }));

  it('should show notification on load error', fakeAsync(() => {
    orderServiceSpy.getPaged.and.returnValue(throwError(() => new Error('Failed')));
    component.loadPage();
    tick();
    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to load orders.', 'Close');
    expect(component.isLoading).toBeFalse();
  }));

  it('should export all orders to Excel', fakeAsync(() => {
    component.totalRecords = pagedOrdersMock.data.length;
    (orderServiceSpy.getPaged as jasmine.Spy).and.returnValue(of(pagedOrdersMock));

    component.exportOrdersExcel();
    tick();

    expect(orderServiceSpy.getPaged).toHaveBeenCalled();
    expect(component['exportService'].exportToExcel).toHaveBeenCalledWith(pagedOrdersMock.data, 'Orders', component.headerMap);
  }));

  it('should export all orders to CSV', fakeAsync(() => {
    component.totalRecords = pagedOrdersMock.data.length;
    (orderServiceSpy.getPaged as jasmine.Spy).and.returnValue(of(pagedOrdersMock));

    component.exportOrdersCSV();
    tick();

    expect(orderServiceSpy.getPaged).toHaveBeenCalled();
    expect(component['exportService'].exportToCSV).toHaveBeenCalledWith(pagedOrdersMock.data, 'Orders', component.headerMap);
  }));

  it('should show notification when no orders to export', fakeAsync(() => {
    component.totalRecords = 0;
    component.exportOrdersExcel();
    tick();
    expect(notificationSpy.show).toHaveBeenCalledWith('No orders to export.', 'Close');
  }));
});
