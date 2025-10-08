export interface MonthlyCountDto {
  month: number;
  count: number;
}

export interface DashboardStatsDto {
  totalOrders: number;
  totalSchedules: number;
  totalUsers: number;
  monthlyOrders: MonthlyCountDto[];
  monthlySchedules: MonthlyCountDto[];
}