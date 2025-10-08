namespace taskmaster_pro.Application.Features.Orders.Queries.OrderExists
{
    public class OrderExistsQueryHandler : IRequestHandler<OrderExistsQuery, bool>
    {
        private readonly IOrderRepositoryAsync _repository;

        public OrderExistsQueryHandler(IOrderRepositoryAsync repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(OrderExistsQuery request, CancellationToken cancellationToken)
        {
            return await _repository.ExistsAsync(request.Id);
        }
    }
}
