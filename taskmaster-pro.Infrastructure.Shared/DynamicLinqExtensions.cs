using System.Linq.Dynamic.Core;

namespace taskmaster_pro.Infrastructure.Shared
{
    public static class DynamicLinqExtensions
    {
        /// <summary>
        /// Applies dynamic ordering to a queryable collection.
        /// Usage: query = query.ApplyOrdering("ColumnName", "asc");
        /// </summary>
        /// <typeparam name="T">Type of the IQueryable</typeparam>
        /// <param name="source">The IQueryable to sort</param>
        /// <param name="columnName">Column/property name</param>
        /// <param name="direction">"asc", "desc", or null (no ordering)</param>
        /// <returns>Ordered IQueryable</returns>
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> source, string columnName, string direction)
        {
            if (string.IsNullOrWhiteSpace(columnName) || string.IsNullOrWhiteSpace(direction))
                return source; // no ordering applied

            direction = direction.ToLower();
            if (direction != "asc" && direction != "desc")
                throw new ArgumentException("Sort direction must be 'asc' or 'desc'.");

            // Use System.Linq.Dynamic.Core for dynamic ordering
            return source.OrderBy($"{columnName} {direction}");
        }
    }
}
