namespace taskmaster_pro.Infrastructure.Shared.Mock
{
    /// <summary>
    /// Bogus configuration for generating fake Schedule data.
    /// </summary>
    public class ScheduleBogusConfig : Faker<Schedule>
    {
        public ScheduleBogusConfig(IEnumerable<Guid> orderIds, IEnumerable<string> userIds, string createdBy = null, DateTime? createdAt = null)
        {
            var orderIdList = orderIds?.ToList() ?? new List<Guid>();
            var userList = userIds?.ToList() ?? new List<string>();

            RuleFor(s => s.Id, f => f.Random.Guid());
            RuleFor(s => s.OrderId, f => f.PickRandom(orderIdList));
            RuleFor(s => s.UserId, f => f.PickRandom(userList));
            RuleFor(s => s.ScheduledStart, f => f.Date.Soon());
            RuleFor(s => s.ScheduledEnd, (f, s) => s.ScheduledStart.AddHours(f.Random.Double(1, 4)));
            RuleFor(s => s.Title, f => f.Lorem.Sentence(3));
            RuleFor(s => s.AssignedToId, f => f.PickRandom(userList));
            RuleFor(s => s.Description, f => f.Lorem.Paragraph());
            RuleFor(s => s.Created, f => createdAt ?? f.Date.Recent());
            RuleFor(s => s.CreatedBy, f => createdBy ?? f.PickRandom(userList));
            RuleFor(s => s.Updated, f => null);
            RuleFor(s => s.UpdatedBy, f => null);
        }
    }
}
