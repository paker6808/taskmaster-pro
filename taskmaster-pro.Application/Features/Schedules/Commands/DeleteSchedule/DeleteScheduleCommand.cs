namespace taskmaster_pro.Application.Features.Schedules.Commands.DeleteSchedule
{
    public class DeleteScheduleCommand : IRequest<Guid>
    {
        public Guid Id { get; set; }
    }
}
