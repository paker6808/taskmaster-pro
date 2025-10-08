import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { UpdateOrderDto, OrderStatus } from '../../../shared/models/order';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderService } from '../../../core/services/order.service';
import { toIsoMidnight } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  editForm!: FormGroup;
  orderId!: string;
  orderStatuses = Object.values(OrderStatus);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;

    this.editForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      orderDate:    [new Date(), Validators.required],
      status:       [null, Validators.required],
      totalAmount:  [null, [Validators.required, Validators.min(0.01)]]
    });

    this.orderService.getById(this.orderId).subscribe(order => {
      this.editForm.patchValue(order);
    });
  }

  onSubmit() {
     if (this.editForm.invalid) return;

    const dto: UpdateOrderDto = {
      id: this.orderId,
      customerName: this.editForm.value.customerName,
      orderDate: toIsoMidnight(this.editForm.value.orderDate),
      status: this.editForm.value.status,
      totalAmount: this.editForm.value.totalAmount
    };

    this.orderService.update(this.orderId, dto).subscribe({
      next: () => {
        this.notification.show('Order edited!');
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.notification.show('Failed to edit order', 'Close');
      }
    });
  }

  cancel() {
    this.router.navigate(['/orders']);
  }

  // Getters for form controls
  get status() {
    return this.editForm.get('status')!;
  }
  get customerName() {
    return this.editForm.get('customerName')!;
  }
  get orderDate() {
    return this.editForm.get('orderDate')!;
  }
  get totalAmount() {
    return this.editForm.get('totalAmount')!;
  }
}