namespace taskmaster_pro.Application.Interfaces
{
    /// <summary>
    /// Defines a mock service for generating Order and Schedule data.
    /// </summary>
    public interface IMockService
    {
        /// <summary>
        /// Generates a list of mock orders.
        /// </summary>
        /// <param name="rowCount">Number of orders to generate.</param>
        /// <returns>A list of mock orders.</returns>
        List<Order> GetOrders(int rowCount);

        /// <summary>
        /// Generates a list of mock schedules related to given orders.
        /// </summary>
        /// <param name="rowCount">Number of schedules to generate.</param>
        /// <param name="orders">The orders to associate schedules with.</param>
        /// <param name="userIds">A list of user IDs to assign to schedules.</param>
        /// <returns>A list of mock schedules.</returns>
        List<Schedule> GetSchedules(int rowCount, IEnumerable<Order> orders, IEnumerable<string> userIds);
    }
}
