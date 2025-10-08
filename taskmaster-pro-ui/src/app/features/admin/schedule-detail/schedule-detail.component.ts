import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/modules/material.module';
import { ScheduleService } from '../../../core/services/schedule.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ScheduleDetailDto } from '../../../shared/models/schedule';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
  standalone: true,
  imports: [
      CommonModule,
      MaterialModule
    ]
})
export class ScheduleDetailComponent implements OnInit {
  schedule: ScheduleDetailDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private scheduleService: ScheduleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadSchedule(id);
  }

  loadSchedule(id: string): void {
    this.scheduleService.getById(id).subscribe({
      next: (data) => (this.schedule = data),
      error: () => (this.schedule = null)
    });
  }

  copyId() {
    if (!this.schedule?.id) return;
    this.clipboard.copy(this.schedule.id);
    this.notificationService.show('Schedule ID copied to clipboard');
  }

  backToSchedules(): void {
    this.router.navigate(['/admin/schedules']);
  }
}
