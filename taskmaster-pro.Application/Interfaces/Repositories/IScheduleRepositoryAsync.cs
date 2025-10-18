using taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;
using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardStatsQuery;

namespace taskmaster_pro.Application.Interfaces.Repositories
{
    /// <summary>
    /// Repository interface for Schedule entity with asynchronous methods.
    /// </summary>
    public interface IScheduleRepositoryAsync
    {
        #region UI-specific methods

        /// <summary>
        /// Retrieves a schedule by its ID, including the assigned user details.
        /// </summary>
        Task<ScheduleViewModel?> GetByIdWithAssignedUserAsync(Guid id);

        #endregion

        #region Domain-level reading methods (used by handlers)

        /// <summary>
        /// Retrieves a schedule by its unique identifier.
        /// </summary>
        Task<Schedule?> GetByIdAsync(Guid id);

        /// <summary>
        /// Retrieves all schedules with optional ordering and field selection.
        /// </summary>
        Task<IEnumerable<Schedule>> GetAllShapeAsync(string orderBy, string fields);

        /// <summary>
        /// Retrieves a filtered and shaped list of schedules for the logged user based on the provided query parameters.
        /// </summary>
        Task<(IEnumerable<GetSchedulesViewModel> data, int totalRecords)> GetUserSchedulesAsync(GetSchedulesQuery requestParameters);


        /// <summary>
        /// Retrieves a paged list of schedules for the logged user based on the provided query parameters.
        /// </summary>
        Task<(IEnumerable<PagedSchedulesViewModel> data, long recordsCount)> GetPagedUserSchedulesAsync(PagedSchedulesQuery requestParameters);

        /// <summary>
        /// Retrieves a collection of schedules associated with the specified order ID.
        /// </summary>
        Task<IEnumerable<Schedule>> GetByOrderIdAsync(Guid orderId);

        /// <summary>
        /// Gets the total number of schedules in the system.
        /// </summary>
        Task<int> GetTotalSchedulesAsync();

        /// <summary>
        /// Gets the number of schedules placed in the current month.
        /// </summary>
        Task<List<MonthlyCountDto>> GetMonthlyScheduleCountsAsync(int year);

        #endregion

        #region CRUD methods

        /// <summary>
        /// Adds a new schedule to the repository.
        /// </summary>
        Task<Schedule> AddAsync(Schedule schedule);

        /// <summary>
        /// Updates an existing schedule in the repository.
        /// </summary>
        Task<Schedule> UpdateAsync(Schedule schedule);

        /// <summary>
        /// Deletes a schedule from the repository.
        /// </summary>
        Task DeleteAsync(Schedule schedule);

        #endregion

        #region Additional methods

        /// <summary>
        /// Seeds initial data into the Schedules table.
        /// </summary>
        Task<bool> SeedDataAsync(int rowCount);

        #endregion
    }
}