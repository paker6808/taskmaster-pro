import { ScheduleDto } from '../../../shared/models/schedule';

export interface PagedAllSchedules {
  draw: number;
  recordsTotal: number;
  data: ScheduleDto[];
}