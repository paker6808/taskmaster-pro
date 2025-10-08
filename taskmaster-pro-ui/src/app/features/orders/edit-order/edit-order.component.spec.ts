import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditOrderComponent } from './edit-order.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { updateOrderMock } from '../../../shared/mock-data';

describe('EditOrderComponent', () => {
  let component: EditOrderComponent;
  let fixture: ComponentFixture<EditOrderComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['getById', 'update']);
    const notifySpy = jasmine.createSpyObj('NotificationService', ['show']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    orderSpy.getById.and.returnValue(of(updateOrderMock));

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, MaterialModule, EditOrderComponent],
      providers: [
        FormBuilder,
        { provide: OrderService, useValue: orderSpy },
        { provide: NotificationService, useValue: notifySpy },
        { provide: Router, useValue: rSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '123' }) }
          }
        }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrderComponent);
    component = fixture.componentInstance;
    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    notificationSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize editForm with controls and patch values from getById', () => {
    expect(component.editForm).toBeTruthy();
    expect(component.customerName.value).toBe(updateOrderMock.customerName);
    expect(component.status.value).toBe(updateOrderMock.status);
    expect(component.orderDate.value).toEqual(updateOrderMock.orderDate);
    expect(component.totalAmount.value).toBe(updateOrderMock.totalAmount);
  });

  it('should not submit if form is invalid', () => {
    component.editForm.patchValue({ customerName: '', status: null, totalAmount: null });
    component.onSubmit();
    expect(orderServiceSpy.update).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate on success', fakeAsync(() => {
    const customUpdateOrderMock = {
      ...updateOrderMock,
      id: '123',  // match the route param
      orderDate: '2040-01-01T00:00:00.000Z' // match toIsoMidnight output
    };

    component.editForm.patchValue(customUpdateOrderMock);
    orderServiceSpy.update.and.returnValue(of(void 0));

    component.onSubmit();
    tick();

    expect(orderServiceSpy.update).toHaveBeenCalledWith('123', jasmine.objectContaining(customUpdateOrderMock));
    expect(notificationSpy.show).toHaveBeenCalledWith('Order edited!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
  }));

  it('should handle update error and show notification', fakeAsync(() => {
    component.editForm.patchValue(updateOrderMock);
    orderServiceSpy.update.and.returnValue(throwError(() => new Error('Failed')));

    component.onSubmit();
    tick();

    expect(notificationSpy.show).toHaveBeenCalledWith('Failed to edit order', 'Close');
  }));

  it('should call router.navigate on cancel', () => {
    component.cancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
