namespace taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById
{
    public class GetScheduleByIdQuery : IRequest<ScheduleViewModel>
    {
        public Guid Id { get; set; }
    }
}
