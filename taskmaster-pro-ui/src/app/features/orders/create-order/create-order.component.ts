import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { CreateOrderDto, OrderStatus } from '../../../shared/models/order';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { toIsoMidnight } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  orderForm!: FormGroup;
  isSubmitting = false;
  orderStatuses = Object.values(OrderStatus);

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      orderDate: [new Date(), Validators.required],
      status: [null, Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  submit() {
    if (this.orderForm.invalid)
      return;
    
    this.isSubmitting = true;

    const dto: CreateOrderDto = {
      customerName: this.orderForm.value.customerName,
      orderDate: toIsoMidnight(this.orderForm.value.orderDate),
      status: this.orderForm.value.status,
      totalAmount: this.orderForm.value.totalAmount
    };

    this.orderService.create(dto).subscribe({
      next: () => {
        this.notification.show('Order created!');
        this.isSubmitting = false;  
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.notification.show('Failed to create order', 'Close');
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/orders']);
  }

  // Getters for form controls
  get status() {
    return this.orderForm.get('status')!;
  }
  get customerName() {
    return this.orderForm.get('customerName')!;
  }
  get orderDate() {
    return this.orderForm.get('orderDate')!;
  }
  get totalAmount() {
    return this.orderForm.get('totalAmount')!;
  }
}