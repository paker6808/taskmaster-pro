using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;

namespace taskmaster_pro.Application.Features.Orders.Queries
{
    public class PagedOrdersQueryHandler
        : IRequestHandler<PagedOrdersQuery, PagedDataTableResponse<IEnumerable<PagedOrdersViewModel>>>
    {
        private readonly IOrderRepositoryAsync _repository;
        private readonly ICurrentUserService _currentUserService;

        public PagedOrdersQueryHandler(IOrderRepositoryAsync repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<PagedDataTableResponse<IEnumerable<PagedOrdersViewModel>>> Handle(
            PagedOrdersQuery request,
            CancellationToken cancellationToken)
        {
            // Map DataTable-style params to standard paging
            request.PageNumber = (request.Start / request.Length) + 1;
            request.PageSize = request.Length;

            // Build OrderBy string if sorting exists
            if (request.Order?.Any() == true && request.Order[0].Column >= 0)
            {
                var sortColumn = request.Columns[request.Order[0].Column].Data;
                var sortDir = request.Order[0].Dir?.ToLower() == "desc" ? "DESC" : "ASC";

                request.OrderBy = sortColumn switch
                {
                    "orderNumber" => $"OrderNumber {sortDir}",
                    "customerName" => $"CustomerName {sortDir}",
                    "createdAt" => $"CreatedAt {sortDir}",
                    _ => $"{sortColumn} {sortDir}"
                };
            }

            // Decide if current user is admin
            bool isAdmin = _currentUserService.GetUserRole() == "Admin";

            // Call repository
            var (orders, totalRecords) = await _repository.GetPagedUserOrdersAsync(request, isAdmin);

            return new PagedDataTableResponse<IEnumerable<PagedOrdersViewModel>>(
                orders,
                request.Draw,
                (int)totalRecords
            );
        }
    }
}
