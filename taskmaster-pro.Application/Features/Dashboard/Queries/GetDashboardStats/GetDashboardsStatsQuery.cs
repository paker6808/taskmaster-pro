using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardsStatsQueryHandler;

namespace taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard
{
    public record GetDashboardsStatsQueryHandler(int Year) : IRequest<DashboardStatsDto>
    {
        public class DashboardStatsDto
        {
            public int TotalOrders { get; set; }
            public int TotalSchedules { get; set; }
            public int TotalUsers { get; set; }
            public List<MonthlyCountDto> MonthlyOrders { get; set; } = new();
            public List<MonthlyCountDto> MonthlySchedules { get; set; } = new();
        }

        public class MonthlyCountDto
        {
            public int Month { get; set; }
            public int Count { get; set; }
        }
    }
}
