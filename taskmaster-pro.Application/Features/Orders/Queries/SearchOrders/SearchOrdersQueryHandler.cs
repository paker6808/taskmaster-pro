
namespace taskmaster_pro.Application.Features.Orders.Queries.SearchOrders
{
    public class SearchOrdersQueryHandler : IRequestHandler<SearchOrdersQuery, List<Order>>
    {
        private readonly IOrderRepositoryAsync _repository;

        public SearchOrdersQueryHandler(IOrderRepositoryAsync repository)
        {
            _repository = repository;
        }

        public async Task<List<Order>> Handle(SearchOrdersQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Query) || request.Query.Length < 2)
                return new List<Order>();

            return await _repository.SearchAsync(request.Query);
        }
    }
}
