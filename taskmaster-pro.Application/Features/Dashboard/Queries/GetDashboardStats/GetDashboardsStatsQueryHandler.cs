using taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard;
using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardsStatsQueryHandler;

namespace taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardsStatsQueryHandler, DashboardStatsDto>
    {
        private readonly IOrderRepositoryAsync _orderRepository;
        private readonly IScheduleRepositoryAsync _scheduleRepository;
        private readonly IUserService _userService;
        private readonly ICurrentUserService _currentUserService;

        public GetDashboardStatsQueryHandler(
            IOrderRepositoryAsync orderRepository,
            IScheduleRepositoryAsync scheduleRepository,
            IUserService userService,
            ICurrentUserService currentUserService)
        {
            _orderRepository = orderRepository;
            _scheduleRepository = scheduleRepository;
            _userService = userService;
            _currentUserService = currentUserService;
        }

        public async Task<DashboardStatsDto> Handle(GetDashboardsStatsQueryHandler request, CancellationToken cancellationToken)
        {
            var year = request.Year;

            // Totals
            var totalOrders = await _orderRepository.GetTotalOrdersAsync();
            var totalSchedules = await _scheduleRepository.GetTotalSchedulesAsync();

            int totalUsers = 0;
            if (_currentUserService.GetUserRole() == "Admin")
            {
                totalUsers = await _userService.GetTotalUsersAsync(true);
            }

            // Monthly stats
            var monthlyOrders = await _orderRepository.GetMonthlyOrderCountsAsync(year);
            var monthlySchedules = await _scheduleRepository.GetMonthlyScheduleCountsAsync(year);

            return new DashboardStatsDto
            {
                TotalOrders = totalOrders,
                TotalSchedules = totalSchedules,
                TotalUsers = totalUsers,
                MonthlyOrders = monthlyOrders,
                MonthlySchedules = monthlySchedules
            };
        }
    }
}
