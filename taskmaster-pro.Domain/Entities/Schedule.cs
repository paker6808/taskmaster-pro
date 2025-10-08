namespace taskmaster_pro.Domain.Entities
{
    public class Schedule
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid OrderId { get; set; }
        public DateTime ScheduledStart { get; set; }
        public DateTime ScheduledEnd { get; set; }
        public string Description { get; set; }

        public string? AssignedToId { get; set; }
        public string UserId { get; set; }

        public DateTime Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Updated { get; set; }
        public string? UpdatedBy { get; set; }

        public Order Order { get; set; }
    }
}