import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { orderDetailMock } from '../../../shared/mock-data';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: any;
  let orderServiceSpy: any;
  let notificationSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;

  beforeEach(() => {
    orderServiceSpy = {
      getById: jasmine.createSpy('getById').and.returnValue(of({ id: '123', customerName: 'John' }))
    };
    notificationSpy = { show: jasmine.createSpy('show') };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);

    TestBed.configureTestingModule({
      imports: [OrderDetailComponent, CommonModule, MaterialModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Clipboard, useValue: clipboardSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order on init', fakeAsync(() => {
    orderServiceSpy.getById.and.returnValue(of(orderDetailMock));
    component.ngOnInit();
    tick(); // flush async

    expect(orderServiceSpy.getById).toHaveBeenCalledWith('123');
    expect(component.order).toEqual(orderDetailMock);
  }));

  it('should handle error when loading order', fakeAsync(() => {
    orderServiceSpy.getById.and.returnValue(throwError(() => new Error('API error')));
    component.loadOrder('123');
    tick();

    expect(component.order).toBeNull();
  }));

  it('should copy order id to clipboard', () => {
    component.order = orderDetailMock;
    component.copyId();

    expect(clipboardSpy.copy).toHaveBeenCalledWith(orderDetailMock.id);
    expect(notificationSpy.show).toHaveBeenCalledWith('Order ID copied to clipboard');
  });

  it('should not copy if order id is null', () => {
    component.order = { id: '', customerName: 'John' } as any;
    component.copyId();

    expect(clipboardSpy.copy).not.toHaveBeenCalled();
    expect(notificationSpy.show).not.toHaveBeenCalled();
  });

  it('should navigate back to orders', () => {
    component.backToOrders();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/orders']);
  });
});
