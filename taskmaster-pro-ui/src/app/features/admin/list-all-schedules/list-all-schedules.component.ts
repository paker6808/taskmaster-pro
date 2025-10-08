import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { AdminService } from '../services/admin.service';
import { ExportService } from '../../../shared/services/export.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExportScheduleRow } from '../../../shared/models/export-schedule-row';
import { PagedSchedulesViewModel }from '../../../shared/models/paged-schedules';
import { PagedAllSchedulesQuery } from '../models/paged-all-schedules-query';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { Inject } from '@angular/core';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../../shared/config/pagination-config';

@Component({
  selector: 'app-list-all-schedules',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './list-all-schedules.component.html',
  styleUrls: ['./list-all-schedules.component.scss']
})
export class ListAllSchedulesComponent implements OnInit {
  displayedColumns = [
    'id',
    'orderId',
    'title',
    'scheduledStart',
    'scheduledEnd',
    'assignedTo',
    'description',
    'actions'
  ];
  schedules: PagedSchedulesViewModel[] = [];
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
    orderId: 'Order ID',
    scheduledStart: 'Start',
    scheduledEnd: 'End',
    title: 'Title',
    description: 'Description',
    assignedTo: 'Assigned To',
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

    const query: PagedAllSchedulesQuery = {
      draw:   this.pageIndex + 1,
      start:  this.pageIndex * this.pageSize,
      length: this.pageSize,
      order:  [{ column: this.sortColumn, dir: this.sortDirection }],
      columns: this.displayedColumns.map(col => ({
        data: col,
        name: '',
        orderable: true
      }))
    };

    this.adminService.getPagedSchedules(query).subscribe({
      next: res => {
        this.schedules = res.data;
        this.totalRecords = res.recordsTotal;
        this.isLoading = false;
      },
      error: () => {
        this.notification.show('Failed to load schedules.', 'Close');
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

  viewSchedule(id: string): void {
    this.router.navigate(['/admin/schedules', id]);
  }

  deleteSchedule(id: string): void {
    const data: ConfirmDialogData = {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this schedule?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    this.dialogService.confirm(data).subscribe(confirmed => {
      if (!confirmed) return;

      this.adminService.deleteSchedule(id).subscribe({
        next: () => {
          this.notification.show('Schedule deleted successfully.');
          this.loadPage();
        },
        error: () => {
          this.notification.show('Could not delete schedule.', 'Close');
        }
      });
    });
  }

  exportSchedulesExcel() {
    this.fetchAllSchedulesForExport(allSchedules => {
      this.exportService.exportToExcel(allSchedules, 'Schedules', this.headerMap);
    });
  }

  exportSchedulesCSV() {
    this.fetchAllSchedulesForExport(allSchedules => {
      this.exportService.exportToCSV(allSchedules, 'Schedules', this.headerMap);
    });
  }
  
  private fetchAllSchedulesForExport(callback: (schedules: ExportScheduleRow[]) => void) {
    if (this.totalRecords === 0) {
      this.notification.show('No schedules to export.', 'Close');
      return;
    }

    const query: PagedAllSchedulesQuery = {
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
    this.adminService.getPagedSchedules(query).subscribe({
      next: res => {
        const mapped: ExportScheduleRow[] = res.data.map(s => ({
          id: s.id,
          orderId: s.orderId,
          scheduledStart: s.scheduledStart,
          scheduledEnd: s.scheduledEnd,
          title: s.title,
          description: s.description,
          assignedTo: s.assignedTo?.displayName ?? s.assignedTo?.id ?? '',
          created: s.created,
          createdBy: s.createdBy,
          updated: s.updated ?? '',
          updatedBy: s.updatedBy ?? ''
        }));
        callback(mapped);
        this.isLoading = false;
      },
      error: () => {
        this.notification.show('Failed to export schedules.', 'Close');
        this.isLoading = false;
      }
    });
  }
}
