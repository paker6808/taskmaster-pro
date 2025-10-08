import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { AdminService } from '../services/admin.service';
import { ExportService } from '../../../shared/services/export.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PagedOrdersViewModel }from '../../../shared/models/paged-orders';
import { PagedAllOrdersQuery } from '../models/paged-all-orders-query';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { Inject } from '@angular/core';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';

@Component({
  selector: 'list-all-orders',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './list-all-orders.component.html',
  styleUrls: ['./list-all-orders.component.scss']
})
export class ListAllOrdersComponent implements OnInit {
  displayedColumns = [
    'id',
    'customerName',
    'orderDate',
    'status',
    'totalAmount',
    'userEmail',
    'actions'
  ];
  orders: PagedOrdersViewModel[] = [];
  isLoading = false;

  // Paging & sorting
  pageSize: number;
  pageIndex = 0;
  totalRecords = 0;
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
    private adminService: AdminService,
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

  private loadPage(): void {
    this.pageSize  = Math.max(1, this.pageSize);
    this.pageIndex = Math.max(0, this.pageIndex);

    this.isLoading = true;

    const orderArray: { column: number; dir: "" | "asc" | "desc" }[] = 
      (this.sortColumn >= 0)
        ? [{ column: this.sortColumn, dir: this.sortDirection }]
        : [{ column: 0, dir: 'asc' as 'asc' }];


    const query: PagedAllOrdersQuery = {
      draw:   this.pageIndex + 1,
      start:  this.pageIndex * this.pageSize,
      length: this.pageSize,
      order:  orderArray,
      columns: this.displayedColumns.map(col => ({
        data: col,
        name: '',
        orderable: true
      }))
    };

    this.adminService.getPagedOrders(query).subscribe({
      next: res => {
        console.log('API Response:', res);
        this.orders = res.data;
        this.totalRecords = res.recordsTotal || 0;
        this.isLoading = false;
      },
      error: () => {
        this.notification.show('Failed to load orders.', 'Close');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadPage();
  }

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

  viewOrder(id: string): void {
    this.router.navigate(['/admin/orders', id]);
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

      this.adminService.deleteOrder(id).subscribe({
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

  private fetchAllOrdersForExport(callback: (allOrders: PagedOrdersViewModel[]) => void) {
    if (this.totalRecords === 0) {
      this.notification.show('No orders to export.', 'Close');
      return;
    }

    const query: PagedAllOrdersQuery = {
      draw: 1,
      start: 0,
      length: this.totalRecords,
      order: (this.sortColumn >= 0)
        ? [{ column: this.sortColumn, dir: this.sortDirection }]
        : [{ column: 0, dir: 'asc' as 'asc' }],
      columns: this.displayedColumns.map(col => ({
        data: col,
        name: '',
        orderable: true
      }))
    };

    this.isLoading = true;
    this.adminService.getPagedOrders(query).subscribe({
      next: res => {
        this.isLoading = false;
        callback(res.data);
      },
      error: () => {
        this.isLoading = false;
        this.notification.show('Failed to fetch all orders for export.', 'Close');
      }
    });
  }
}
