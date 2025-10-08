import { UserDto } from './user.dto';

export interface PagedDataTableResponse<T> {
  data: T[];
  draw: number;
  recordsTotal: number;
}

export interface ScheduleColumn {
  data: string;
  name: string;
  orderable: boolean;
}

export interface ScheduleSort {
  column: number;
  dir: 'asc' | 'desc' | '';
}

export interface PagedSchedulesQuery {
  draw:   number;
  start:  number;
  length: number;
  order:  ScheduleSort[];
  columns?: ScheduleColumn[];
}

export interface PagedSchedulesViewModel {
  id: string;
  title: string;
  orderId: string;
  scheduledStart: string;
  scheduledEnd: string;
  description: string;
  assignedTo?: UserDto;
  created: string;
  createdBy: string;
  updated?: string;
  updatedBy?: string;
}
