using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;
using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardsStatsQueryHandler;

namespace taskmaster_pro.Application.Interfaces.Repositories
{
    /// <summary>
    /// Repository interface for Order entity with asynchronous methods.
    /// </summary>
    public interface IOrderRepositoryAsync : IGenericRepositoryAsync<Order>
    {
        /// <summary>
        /// Retrieves a filtered and shaped list of orders for the logged user based on the provided query parameters.
        /// </summary>
        Task<(IEnumerable<Order> data, int totalRecords)> GetUserOrdersAsync(GetOrdersQuery requestParameters);

        /// <summary>
        /// Retrieves a paged list of orders for the logged user based on the provided query parameters.
        /// </summary>
        Task<(IEnumerable<PagedOrdersViewModel> data, long recordsCount)> GetPagedUserOrdersAsync(PagedOrdersQuery requestParametersbool, bool isAdmin);

        /// <summary>
        /// Gets the total number of orders in the system.
        /// </summary>
        Task<int> GetTotalOrdersAsync();

        /// <summary>
        /// Gets the number of orders placed in the current month.
        /// </summary>
        Task<List<MonthlyCountDto>> GetMonthlyOrderCountsAsync(int year);

        /// <summary>
        /// Checks if an order with the specified ID exists.
        /// </summary>
        Task<bool> ExistsAsync(Guid id);

        /// <summary>
        /// Searches for orders matching the given query string.
        /// </summary>
        Task<List<Order>> SearchAsync(string query);

        /// <summary>
        /// Seeds initial data into the Orders table.
        /// </summary>
        Task<bool> SeedDataAsync(int rowCount);
    }
}