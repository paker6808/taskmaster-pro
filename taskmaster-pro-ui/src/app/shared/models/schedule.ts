import { UserDto } from './user.dto';

export interface ScheduleDto {
  id: string;
  orderId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  description: string;
  assignedTo?: UserDto;
  created: string;
  createdBy: string;
  updated?: string;
  updatedBy?: string;
}

export interface CreateScheduleDto {
  orderId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  description: string;
  assignedToId: string;
}

export interface UpdateScheduleDto {
  id: string;
  orderId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  description: string;
  assignedToId: string;
}

export interface ScheduleDetailDto {
  id: string;
  orderId: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  description: string;
  assignedTo?: UserDto;
  created: string;
  createdBy?: UserDto;
  updated?: string;
  updatedBy?: UserDto;
}