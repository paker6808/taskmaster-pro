using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace taskmaster_pro.Infrastructure.Persistence.Extensions
{
    public static class IQueryableExtensions
    {
        // Existing single-string variant: accepts "Created desc" or "Title"
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy))
                return query;

            try
            {
                var parts = orderBy.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                var propertyName = NormalizeToPascalCase(parts[0]);
                var ascending = parts.Length < 2 || !parts[1].Equals("desc", StringComparison.OrdinalIgnoreCase);

                return query.ApplyOrdering(propertyName, ascending);
            }
            catch
            {
                return query; // Fail-safe: if something goes wrong, return original query
            }
        }

        // New overload used by your code: ApplyOrdering(columnName, direction)
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, string columnName, string direction)
        {
            if (string.IsNullOrWhiteSpace(columnName))
                return query;

            var ascending = !string.Equals(direction, "desc", StringComparison.OrdinalIgnoreCase);
            columnName = NormalizeToPascalCase(columnName);
            return query.ApplyOrdering(columnName, ascending);
        }

        // Internal worker that actually builds the expression
        private static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, string columnName, bool ascending)
        {
            try
            {
                var parameter = Expression.Parameter(typeof(T), "x");
                var property = Expression.PropertyOrField(parameter, columnName);
                var lambda = Expression.Lambda(property, parameter);

                var methodName = ascending ? "OrderBy" : "OrderByDescending";
                var method = typeof(Queryable).GetMethods()
                    .First(m => m.Name == methodName && m.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(T), property.Type);

                return (IQueryable<T>)method.Invoke(null, new object[] { query, lambda })!;
            }
            catch
            {
                // Property not found or other error -> return original query
                return query;
            }
        }

        private static string NormalizeToPascalCase(string s)
        {
            if (string.IsNullOrWhiteSpace(s)) return s;

            // Split on typical separators and remove empties
            var parts = Regex.Split(s, @"[._\-\s]+")
                             .Where(p => !string.IsNullOrEmpty(p))
                             .ToArray();
            if (parts.Length == 0) return s;

            // Uppercase first char of each part, keep rest as-is
            var pascal = string.Concat(parts.Select(p => char.ToUpperInvariant(p[0]) + (p.Length > 1 ? p.Substring(1) : string.Empty)));
            return pascal;
        }
    }
}
