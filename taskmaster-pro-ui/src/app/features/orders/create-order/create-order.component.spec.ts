import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateOrderComponent } from './create-order.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { toIsoMidnight } from '../../../shared/utils/date-utils';
import { createOrderMock } from '../../../shared/mock-data';

describe('CreateOrderComponent', () => {
  let component: CreateOrderComponent;
  let fixture: ComponentFixture<CreateOrderComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['create']);
    const notifySpy = jasmine.createSpyObj('NotificationService', ['show']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, MaterialModule, CreateOrderComponent],
      providers: [
        FormBuilder,
        { provide: OrderService, useValue: orderSpy },
        { provide: NotificationService, useValue: notifySpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    notificationSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the orderForm with controls', () => {
    expect(component.orderForm).toBeTruthy();
    expect(component.customerName).toBeTruthy();
    expect(component.status).toBeTruthy();
    expect(component.orderDate).toBeTruthy();
    expect(component.totalAmount).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.orderForm.patchValue({ customerName: '', status: null, totalAmount: null });
    component.submit();
    expect(orderServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate on success', fakeAsync(() => {
    component.orderForm.patchValue(createOrderMock);
    
    orderServiceSpy.create.and.returnValue(of(createOrderMock));

    component.submit();
    tick();

    expect(orderServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      customerName: createOrderMock.customerName,
      orderDate: toIsoMidnight(component.orderForm.value.orderDate),
      status: createOrderMock.status,
      totalAmount: createOrderMock.totalAmount
    }));
    expect(notificationSpy.show).toHaveBeenCalledWith('Order created!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
    expect(component.isSubmitting).toBeFalse();
  }));

  it('should handle create error and show notification', fakeAsync(() => {
    component.orderForm.patchValue(createOrderMock);
    orderServiceSpy.create.and.returnValue(throwError(() => new Error('Failed')));

    component.submit();
    tick();

    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to create order', 'Close');
    expect(component.isSubmitting).toBeFalse();
  }));

  it('should call router.navigate on cancel', () => {
    component.cancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
