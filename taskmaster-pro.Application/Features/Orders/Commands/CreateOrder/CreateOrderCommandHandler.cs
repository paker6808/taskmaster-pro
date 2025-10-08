namespace Features.Orders.Commands.CreateOrder
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
    {
        private readonly IOrderRepositoryAsync _orderRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreateOrderCommandHandler(
            IOrderRepositoryAsync orderRepository,
            ICurrentUserService currentUserService
            )
        {
            _orderRepository = orderRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order
            {
                OrderDate = request.OrderDate,
                CustomerName = request.CustomerName,
                Status = request.Status,
                TotalAmount = request.TotalAmount,
                UserId = _currentUserService.UserId,
                Created = DateTime.UtcNow,
                CreatedBy = _currentUserService.UserId
            };

            await _orderRepository.AddAsync(order);
            return order.Id;
        }
    }
}
