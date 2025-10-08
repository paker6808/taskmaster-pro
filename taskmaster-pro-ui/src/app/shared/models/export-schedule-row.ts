export interface ExportScheduleRow {
  id: string;
  orderId: string;
  scheduledStart: string;
  scheduledEnd: string;
  title: string;
  description: string;
  assignedTo: string;
  created: string;
  createdBy: string;
  updated: string | null;
  updatedBy: string | null;
}