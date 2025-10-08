namespace taskmaster_pro.Application.Features.Schedules.Commands.UpdateSchedule
{
    public class UpdateScheduleCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid OrderId { get; set; }
        public DateTime ScheduledStart { get; set; }
        public DateTime ScheduledEnd { get; set; }
        public string Description { get; set; }
        public string? AssignedToId { get; set; }
    }
}
