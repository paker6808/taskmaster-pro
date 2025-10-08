using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderViewModel>
    {
        private readonly IOrderRepositoryAsync _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserService _userService;

        public GetOrderByIdQueryHandler(
            IOrderRepositoryAsync repository,
            ICurrentUserService currentUserService,
            IUserService userService
            )
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _userService = userService;
        }

        public async Task<OrderViewModel> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _repository.GetByIdAsync(request.Id);
            if (entity == null)
                throw new NotFoundException(nameof(Order), request.Id);

            Guid currentUserId = Guid.Parse(_currentUserService.UserId);
            Guid entityUserId = Guid.Parse(entity.UserId);

            var roles = await _userService.GetRolesAsync(currentUserId);
            var isAdmin = roles.Contains("Admin");

            if (!isAdmin && entityUserId != currentUserId)
                throw new NotFoundException(nameof(Order), request.Id);

            // Manually map entity to OrderViewModel to include CreatedBy and UpdatedBy user info
            var orderViewModel = new OrderViewModel
            {
                Id = entity.Id,
                CustomerName = entity.CustomerName,
                OrderDate = entity.OrderDate,
                Status = entity.Status,
                TotalAmount = entity.TotalAmount,
                UserId = entity.UserId,
                Created = entity.Created,
                Updated = entity.Updated,
            };

            // Fetch CreatedBy / UpdatedBy user info from UserService
            if (!string.IsNullOrEmpty(entity.CreatedBy))
            {
                if (Guid.TryParse(entity.CreatedBy, out var createdByGuid))
                    orderViewModel.CreatedBy = await _userService.GetUserByIdAsync(createdByGuid);
                else
                    orderViewModel.CreatedBy = new UserViewModel { FirstName = entity.CreatedBy };
            }

            if (!string.IsNullOrEmpty(entity.UpdatedBy))
            {
                if (Guid.TryParse(entity.UpdatedBy, out var updatedByGuid))
                    orderViewModel.UpdatedBy = await _userService.GetUserByIdAsync(updatedByGuid);
                else
                    orderViewModel.UpdatedBy = new UserViewModel { FirstName = entity.UpdatedBy };
            }

            return orderViewModel;
        }
    }
}