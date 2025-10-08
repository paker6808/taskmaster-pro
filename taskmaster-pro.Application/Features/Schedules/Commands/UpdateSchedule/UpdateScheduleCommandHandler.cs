namespace taskmaster_pro.Application.Features.Schedules.Commands.UpdateSchedule
{
    public class UpdateScheduleCommandHandler : IRequestHandler<UpdateScheduleCommand, Unit>
    {
        private readonly IScheduleRepositoryAsync _scheduleRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateScheduleCommandHandler(
            IScheduleRepositoryAsync scheduleRepository,
            ICurrentUserService currentUserService
            )
        {
            _scheduleRepository = scheduleRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateScheduleCommand request, CancellationToken cancellationToken)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(request.Id);
            if (schedule == null)
                throw new NotFoundException(nameof(Schedule), request.Id);

            var currentUserId = _currentUserService.UserId;
            var isAdmin = string.Equals(_currentUserService.GetUserRole(), "Admin", StringComparison.OrdinalIgnoreCase);

            // Permission: admin can edit any schedule; non-admin can edit only if they are the creator (UserId)
            if (!isAdmin && schedule.UserId != currentUserId)
                throw new NotFoundException(nameof(Schedule), request.Id);

            // If non-admin tries to change AssignedToId (and it's different) -> forbid
            if (!string.IsNullOrWhiteSpace(request.AssignedToId) && request.AssignedToId != schedule.AssignedToId && !isAdmin)
            {
                throw new ForbiddenException("Only admins may reassign schedules to other users.");
            }

            // Apply updates
            schedule.Title = request.Title;
            schedule.ScheduledStart = request.ScheduledStart;
            schedule.ScheduledEnd = request.ScheduledEnd;
            schedule.AssignedToId = request.AssignedToId;
            schedule.Description = request.Description;
            schedule.OrderId = request.OrderId;

            // Admin can change assignedToId (including setting to null); non-admin can only leave it unchanged or set to self if app logic requires
            if (isAdmin)
            {
                schedule.AssignedToId = string.IsNullOrWhiteSpace(request.AssignedToId) ? null : request.AssignedToId;
            }
            // optionally: allow owner to set AssignedToId to themselves if request.AssignedToId == currentUserId
            else if (!string.IsNullOrWhiteSpace(request.AssignedToId) && request.AssignedToId == currentUserId)
            {
                schedule.AssignedToId = currentUserId;
            }

            schedule.Updated = DateTime.UtcNow;
            schedule.UpdatedBy = currentUserId;

            await _scheduleRepository.UpdateAsync(schedule);
            return Unit.Value;
        }
    }
}
