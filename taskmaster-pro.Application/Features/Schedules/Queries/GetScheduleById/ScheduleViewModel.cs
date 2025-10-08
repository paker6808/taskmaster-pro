using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById
{
    public class ScheduleViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid OrderId { get; set; }
        public DateTime ScheduledStart { get; set; }
        public DateTime ScheduledEnd { get; set; }
        public string Description { get; set; }
        public string AssignedToId { get; set; }
        public UserViewModel? AssignedTo { get; set; }
        public string UserId { get; set; }
        public DateTime Created { get; set; }
        public string? CreatedById { get; set; }
        public UserViewModel? CreatedBy { get; set; }
        public DateTime? Updated { get; set; }
        public string? UpdatedById { get; set; }
        public UserViewModel? UpdatedBy { get; set; }
    }
}
