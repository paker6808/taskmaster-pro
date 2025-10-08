import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { OrderService } from  '../../../core/services/order.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { OrderDetailDto  } from '../../../shared/models/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  standalone: true,
  imports: [
      CommonModule,
      MaterialModule
    ]
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetailDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(id);
  }

  loadOrder(id: string): void {
    this.orderService.getById(id).subscribe({
      next: (data) => (this.order = data),
      error: () => (this.order = null)
    });
  }

  copyId() {
    if (!this.order?.id) return;
    this.clipboard.copy(this.order.id);
    this.notificationService.show('Order ID copied to clipboard');
  }

  backToOrders(): void {
    this.router.navigate(['/admin/orders']);
  }
}
