using Microsoft.AspNetCore.Identity;
using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;
using taskmaster_pro.Infrastructure.Shared;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;
using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardsStatsQueryHandler;

namespace taskmaster_pro.Infrastructure.Persistence.Repositories
{
    public class OrderRepositoryAsync : GenericRepositoryAsync<Order>, IOrderRepositoryAsync
    {
        private readonly DbSet<Order> _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderRepositoryAsync(
            ApplicationDbContext dbContext,
            ICurrentUserService currentUserService,
            UserManager<ApplicationUser> userManager
            )
            : base(dbContext)
        {
            _repository = dbContext.Set<Order>();
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<(IEnumerable<Order> data, int totalRecords)> GetUserOrdersAsync(GetOrdersQuery requestParameters)
        {
            var orderBy = requestParameters.OrderBy;
            var pageNumber = requestParameters.PageNumber;
            var pageSize = requestParameters.PageSize;

            var query = _repository.AsNoTracking().AsExpandable()
                .Where(o => o.UserId == _currentUserService.UserId);

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                var parts = orderBy.Split(' ');
                var columnName = parts[0];
                var direction = parts.Length > 1 ? parts[1].ToLower() : "asc";

                query = query.ApplyOrdering(columnName, direction);
            }

            var totalRecords = await query.CountAsync();

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalRecords);
        }

        public async Task<(IEnumerable<PagedOrdersViewModel> data, long recordsCount)> GetPagedUserOrdersAsync(
            PagedOrdersQuery requestParameters,
            bool isAdmin = false)
        {
            var orderBy = requestParameters.OrderBy;
            var pageNumber = Math.Max(1, requestParameters.PageNumber);
            var pageSize = Math.Max(1, requestParameters.PageSize);

            // Base orders query (IQueryable<OrderEntity>)
            var ordersBase = _repository.AsNoTracking();

            // Join orders -> users (use UserManager.Users to get IQueryable<ApplicationUser>)
            var joined = ordersBase
                .Join(_userManager.Users,
                      o => o.UserId,
                      u => u.Id,
                      (o, u) => new { Order = o, UserEmail = u.Email });

            // Apply "only my orders if not admin" filter (use Order.UserId)
            if (!isAdmin || !requestParameters.IncludeAllForAdmin)
            {
                var currentUserId = _currentUserService.UserId;
                joined = joined.Where(x => x.Order.UserId == currentUserId);
            }

            // Count before paging (but after admin filter)
            var totalRecords = await joined.LongCountAsync();

            // Apply ordering (support UserEmail + common order columns on Order)
            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                var parts = orderBy.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                var columnName = parts[0].Trim().ToLowerInvariant();
                var direction = (parts.Length > 1 ? parts[1] : "asc").ToLowerInvariant();
                bool asc = direction != "desc";

                switch (columnName)
                {
                    case "id":
                        joined = asc ? joined.OrderBy(x => x.Order.Id)
                                     : joined.OrderByDescending(x => x.Order.Id);
                        break;

                    case "customername":
                        joined = asc ? joined.OrderBy(x => x.Order.CustomerName)
                                     : joined.OrderByDescending(x => x.Order.CustomerName);
                        break;

                    case "useremail":
                        joined = asc ? joined.OrderBy(x => x.UserEmail)
                                     : joined.OrderByDescending(x => x.UserEmail);
                        break;

                    case "orderdate":
                        joined = asc ? joined.OrderBy(x => x.Order.OrderDate)
                                     : joined.OrderByDescending(x => x.Order.OrderDate);
                        break;

                    case "status":
                        joined = asc ? joined.OrderBy(x => x.Order.Status)
                                     : joined.OrderByDescending(x => x.Order.Status);
                        break;

                    case "totalamount":
                        joined = asc ? joined.OrderBy(x => x.Order.TotalAmount)
                                     : joined.OrderByDescending(x => x.Order.TotalAmount);
                        break;

                    case "created":
                        joined = asc ? joined.OrderBy(x => x.Order.Created)
                                     : joined.OrderByDescending(x => x.Order.Created);
                        break;

                    default:
                        joined = joined.OrderByDescending(x => x.Order.Created); // Fallback
                        break;
                }
            }
            else
            {
                // Default ordering
                joined = joined.OrderByDescending(x => x.Order.Created);
            }

            // Apply paging (SQL-side)
            var pageItems = await joined
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map result
            var mappedData = pageItems.Select(x => new PagedOrdersViewModel
            {
                Id = x.Order.Id,
                CustomerName = x.Order.CustomerName,
                UserEmail = x.UserEmail ?? string.Empty,
                OrderDate = x.Order.OrderDate,
                Status = x.Order.Status.ToString(),
                TotalAmount = x.Order.TotalAmount,
                UserId = Guid.Parse(x.Order.UserId),
                Created = x.Order.Created,
                CreatedBy = x.Order.CreatedBy,
                Updated = x.Order.Updated ?? DateTime.MinValue,
                UpdatedBy = x.Order.UpdatedBy
            }).ToList();

            return (mappedData, totalRecords);
        }

        public async Task<int> GetTotalOrdersAsync()
        {
            return await _repository.CountAsync();
        }

        public async Task<List<MonthlyCountDto>> GetMonthlyOrderCountsAsync(int year)
        {
            var monthGroups = await _repository
                .Where(o => o.OrderDate.Year == year)
                .GroupBy(o => o.OrderDate.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var monthlyCounts = Enumerable.Range(1, 12)
                .Select(m => new MonthlyCountDto
                {
                    Month = m,
                    Count = monthGroups.FirstOrDefault(g => g.Month == m)?.Count ?? 0
                })
                .ToList();

            return monthlyCounts;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _repository.AnyAsync(o => o.Id == id);
        }

        public async Task<List<Order>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
                return new List<Order>();

            Guid guidQuery;
            bool isGuid = Guid.TryParse(query, out guidQuery);

            var matchedOrdersQuery = _repository.AsNoTracking().AsQueryable();

            if (isGuid)
            {
                // Only exact match for full GUID
                matchedOrdersQuery = matchedOrdersQuery.Where(o => o.Id == guidQuery);
            }
            else if (query.Length >= 2)
            {
                // Partial customer name match
                matchedOrdersQuery = matchedOrdersQuery.Where(o => o.CustomerName.Contains(query));
            }

            var matchedOrders = await matchedOrdersQuery
                .OrderBy(o => o.CustomerName)
                .Take(10)
                .ToListAsync();

            // Project to DTO / minimal info
            return matchedOrders.Select(o => new Order
            {
                Id = o.Id,
                CustomerName = o.CustomerName,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount
            }).ToList();
        }

        public Task<bool> SeedDataAsync(int rowCount)
        {
            throw new NotImplementedException();
        }
    }
}