using taskmaster_pro.Domain.Entities;

namespace Features.Orders.Commands.UpdateOrder
{
    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, Unit>
    {
        private readonly IOrderRepositoryAsync _orderRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateOrderCommandHandler(
            IOrderRepositoryAsync orderRepository,
            ICurrentUserService currentUserService
            )
        {
            _orderRepository = orderRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(request.Id);
            if (order == null || order.UserId != _currentUserService.UserId)
                throw new NotFoundException(nameof(Order), request.Id);

            order.Id = request.Id;
            order.OrderDate = request.OrderDate;
            order.CustomerName = request.CustomerName;
            order.Status = request.Status;
            order.TotalAmount = request.TotalAmount;
            order.Updated = DateTime.UtcNow;
            order.UpdatedBy = _currentUserService.UserId;

            await _orderRepository.UpdateAsync(order);
            return Unit.Value;
        }
    }
}
