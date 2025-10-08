namespace taskmaster_pro.Infrastructure.Persistence.Contexts.Entities
{
    public class ScheduleEntity : Schedule
    {
        public ApplicationUser? AssignedTo { get; set; }
        public ApplicationUser User { get; set; }
    }
}
