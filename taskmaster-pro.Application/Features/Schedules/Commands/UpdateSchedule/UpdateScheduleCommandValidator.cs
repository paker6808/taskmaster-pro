namespace taskmaster_pro.Application.Features.Schedules.Commands.CreateSchedule
{
    public class UpdateScheduleCommandValidator : AbstractValidator<UpdateScheduleCommand>
    {
        public UpdateScheduleCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
            RuleFor(x => x.ScheduledStart).NotEmpty();
            RuleFor(x => x.ScheduledEnd).NotEmpty().GreaterThan(x => x.ScheduledStart);
            RuleFor(x => x.AssignedToId).MaximumLength(450);
            RuleFor(x => x.Description).MaximumLength(1000);
            RuleFor(x => x.OrderId).NotEmpty();
        }
    }
}
