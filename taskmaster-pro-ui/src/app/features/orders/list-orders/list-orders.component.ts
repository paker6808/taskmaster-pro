import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { ExportService } from '../../../shared/services/export.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmDialogData  } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderService } from '../../../core/services/order.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { PagedOrdersQuery, PagedOrdersViewModel } from '../../../shared/models/paged-orders';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Inject } from '@angular/core';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  displayedColumns = [
    'id',
    'customerName',
    'orderDate',
    'status',
    'totalAmount',
    'actions'
  ];
  orders: PagedOrdersViewModel[] = [];
  isLoading = false;

  // Paging and sorting
  pageSize: number;
  pageIndex = 0;
  totalRecords = 0;
  draw = 1;

  // Sorting defaults
  sortColumn = -1;
  sortDirection: 'asc' | 'desc' | '' = ''; 

  // Map internal field names to user-friendly headers
  headerMap: Record<string, string> = {
    id: 'ID',
    customerName: 'Customer',
    orderDate: 'Date',
    status: 'Status',
    totalAmount: 'Total',
    userId: 'User ID',
    userEmail: 'User Email',
    created: 'Created',
    createdBy: 'Created By',
    updated: 'Updated',
    updatedBy: 'Updated By'
  };

  constructor(
    private orderService: OrderService,
    private exportService: ExportService,
    private notification: NotificationService,
    private dialogService: DialogService,
    private router: Router,
    @Inject(PAGE_SIZE_OPTIONS) public pageSizeOptions: number[]
  ) {
    this.pageSize = DEFAULT_PAGE_SIZE;
  }

  ngOnInit(): void {
    this.loadPage();
  } 

  /** Loads the current page of orders */
  loadPage(): void {
    this.isLoading = true;
    // Ensure page size is valid, default to 10 if not set
    const effectivePageSize = this.pageSize > 0 ? this.pageSize : 10;

    const query: PagedOrdersQuery = {
      draw:   this.pageIndex + 1,
      start:  this.pageIndex * this.pageSize,
      length: effectivePageSize,
      order:  [{ column: this.sortColumn, dir: this.sortDirection }],
      columns: this.displayedColumns.map(col => ({
        data: col,
        name: '',
        orderable: true
      }))
    };

    this.orderService.getPaged(query).subscribe({
      next: res => {
        this.orders = res.data;
        this.totalRecords = res.recordsTotal;
        this.isLoading = false;
      },
      error: () => {
        this.notification.show('Failed to load orders.', 'Close');
        this.isLoading = false;
      }
    });
  }

  /** Hooks for page changes */
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadPage();
  }

  /** Hooks for sort changes */
  onSortChange(sort: Sort) {
    if (!sort.direction) {
      this.sortColumn = -1;
      this.sortDirection = '';
    } else {
      this.sortColumn = this.displayedColumns.indexOf(sort.active);
      this.sortDirection = sort.direction as 'asc' | 'desc';
    }

    this.loadPage();
  }

  createOrder(): void {
    this.router.navigate(['/orders/create']);
  }

  editOrder(id: string): void {
    this.router.navigate(['/orders/edit', id]);
  }

  deleteOrder(id: string): void {
    const data: ConfirmDialogData = {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this order?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    this.dialogService.confirm(data).subscribe(confirmed => {
      if (!confirmed) return;

      this.orderService.delete(id).subscribe({
        next: () => {
          this.notification.show('Order deleted successfully.');
          this.loadPage();
        },
        error: () => {
          this.notification.show('Could not delete order.', 'Close');
        }
      });
    });
  }

  /** Copy Order ID to clipboard */
  copyId(id: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id).catch(() => {
        console.warn('Clipboard write failed');
      });
    }
  }

  /** Navigate to Create Schedule form prefilled with this Order ID */
  createScheduleFor(id: string): void {
    this.router.navigate(['/schedules/create'], { queryParams: { orderId: id } });
  }

  exportOrdersExcel() {
    this.fetchAllOrdersForExport(allOrders => {
      this.exportService.exportToExcel(allOrders, 'Orders', this.headerMap);
    });
  }

  exportOrdersCSV() {
    this.fetchAllOrdersForExport(allOrders => {
      this.exportService.exportToCSV(allOrders, 'Orders', this.headerMap);
    });
  }

  private fetchAllOrdersForExport(callback: (orders: PagedOrdersViewModel[]) => void) {
    if (this.totalRecords === 0) {
      this.notification.show('No orders to export.', 'Close');
      return;
    }

    const query: PagedOrdersQuery = {
      draw: 1,
      start: 0,
      length: this.totalRecords || 10000,
      order: [{ column: this.sortColumn, dir: this.sortDirection }],
      columns: this.displayedColumns.map(col => ({
        data: col,
        name: '',
        orderable: true
      }))
    };

    this.isLoading = true;
    this.orderService.getPaged(query).subscribe({
      next: res => {
        callback(res.data);
        this.isLoading = false;
      },
      error: () => {
        this.notification.show('Failed to export orders.', 'Close');
        this.isLoading = false;
      }
    });
  }
}
