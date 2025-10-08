    namespace taskmaster_pro.Application.Features.Schedules.Commands.DeleteSchedule
{
    public class DeleteScheduleCommandHandler : IRequestHandler<DeleteScheduleCommand, Guid>
    {
        private readonly IScheduleRepositoryAsync _scheduleRepository;
        private readonly ICurrentUserService _currentUserService;

        public DeleteScheduleCommandHandler(
            IScheduleRepositoryAsync scheduleRepository,
            ICurrentUserService currentUserService
            )
        {
            _scheduleRepository = scheduleRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(DeleteScheduleCommand request, CancellationToken cancellationToken)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(request.Id);

            if (schedule == null)
                throw new NotFoundException(nameof(Schedule), request.Id);

            if (_currentUserService.GetUserRole() != "Admin" && schedule.UserId != _currentUserService.UserId)
                throw new NotFoundException(nameof(Schedule), request.Id);

            try
            {
                await _scheduleRepository.DeleteAsync(schedule);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete schedule {schedule.Id}: {ex.Message}");
            }

            return request.Id;
        }
    }
}
