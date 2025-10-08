using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById
{
    public class GetScheduleByIdQueryHandler : IRequestHandler<GetScheduleByIdQuery, ScheduleViewModel>
    {
        private readonly IScheduleRepositoryAsync _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserService _userService;

        public GetScheduleByIdQueryHandler(
            IScheduleRepositoryAsync repository,
            ICurrentUserService currentUserService,
            IUserService userService
            )
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _userService = userService;
        }

        public async Task<ScheduleViewModel> Handle(GetScheduleByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _repository.GetByIdWithAssignedUserAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Schedule), request.Id);

            var currentUserId = _currentUserService.UserId;
            var isAdmin = string.Equals(_currentUserService.GetUserRole(), "Admin", StringComparison.OrdinalIgnoreCase);

            // Non-admins can only access schedules they created or are assigned to
            if (!isAdmin && entity.UserId != currentUserId && entity.AssignedToId != currentUserId)
                throw new NotFoundException(nameof(Schedule), request.Id);

            // Manually map entity to ScheduleViewModel to include AssignedTo, CreatedBy and UpdatedBy user info
            var scheduleViewModel = entity;
            scheduleViewModel.AssignedTo ??= new UserViewModel { FirstName = "—" };

            // Fetch CreatedBy / UpdatedBy user info from UserService
            if (!string.IsNullOrEmpty(scheduleViewModel.CreatedById))
            {
                if (Guid.TryParse(scheduleViewModel.CreatedById, out var createdByGuid))
                {
                    scheduleViewModel.CreatedBy = await _userService.GetUserByIdAsync(createdByGuid);

                    // Mask email if the creator user is deleted
                    if (scheduleViewModel.CreatedBy.IsDeleted)
                        scheduleViewModel.CreatedBy.Email = MaskEmailForDeletedUsers(scheduleViewModel.CreatedBy.Email);
                }
                else
                {
                    scheduleViewModel.CreatedBy = new UserViewModel
                    {
                        FirstName = scheduleViewModel.CreatedById ?? "—",
                        Email = "—",
                        Roles = new List<string>()
                    };
                }
            }
            if (!string.IsNullOrEmpty(scheduleViewModel.UpdatedById))
            {
                if (Guid.TryParse(scheduleViewModel.UpdatedById, out var updatedByGuid))
                {
                    scheduleViewModel.UpdatedBy = await _userService.GetUserByIdAsync(updatedByGuid);

                    // Mask email if the user that updated the schedule is deleted
                    if (scheduleViewModel.UpdatedBy.IsDeleted)
                        scheduleViewModel.UpdatedBy.Email = MaskEmailForDeletedUsers(scheduleViewModel.UpdatedBy.Email);
                }
                else
                {
                    scheduleViewModel.UpdatedBy = new UserViewModel
                    {
                        FirstName = scheduleViewModel.UpdatedById ?? "—",
                        Email = "—",
                        Roles = new List<string>()
                    };
                }
            }

            return scheduleViewModel;
        }

        private string MaskEmailForDeletedUsers(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return email;
            var parts = email.Split('@');
            if (parts[0].Length <= 2) return "***@" + parts[1];
            return parts[0].Substring(0, 2) + "***@" + parts[1] + " (Deleted User)";
        }
    }
}
