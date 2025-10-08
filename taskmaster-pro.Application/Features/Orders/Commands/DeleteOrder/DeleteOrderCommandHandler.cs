namespace Features.Orders.Commands.DeleteOrder
{
    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, Guid>
    {
        private readonly IOrderRepositoryAsync _orderRepository;
        private readonly IScheduleRepositoryAsync _scheduleRepository;
        private readonly ICurrentUserService _currentUserService;

        public DeleteOrderCommandHandler(
            IOrderRepositoryAsync orderRepository,
            IScheduleRepositoryAsync scheduleRepository,
            ICurrentUserService currentUserService
            )
        {
            _orderRepository = orderRepository;
            _scheduleRepository = scheduleRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            // Get the order
            var order = await _orderRepository.GetByIdAsync(request.Id);
            if (order == null)
                throw new NotFoundException(nameof(Order), request.Id);
            if (_currentUserService.GetUserRole() != "Admin" && order.UserId != _currentUserService.UserId)
                throw new NotFoundException(nameof(Order), request.Id);

            // Delete schedules linked to the order
            var schedules = await _scheduleRepository.GetByOrderIdAsync(order.Id);
            foreach (var schedule in schedules)
            {
                try
                {
                    await _scheduleRepository.DeleteAsync(schedule);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Failed to delete schedule {schedule.Id} linked to order {order.Id}: {ex.Message}");
                }
            }

            // Now delete the order
            try
            {
                await _orderRepository.DeleteAsync(order);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete order {order.Id}: {ex.Message}");
            }

            return request.Id;
        }
    }
}
