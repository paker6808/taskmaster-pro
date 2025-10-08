namespace taskmaster_pro.Infrastructure.Shared.Services
{
    // MockService class implementing IMockService interface
    public class MockService : IMockService
    {
        public List<Order> GetOrders(int rowCount)
        {
            var faker = new Faker<Order>()
              .RuleFor(o => o.Id, f => Guid.NewGuid())
              .RuleFor(o => o.CustomerName, f => f.Name.FullName())
              .RuleFor(o => o.OrderDate, f => f.Date.Past(2))
              .RuleFor(o => o.Status, f => f.PickRandom<OrderStatus>())
              .RuleFor(o => o.TotalAmount, f => f.Finance.Amount(50, 5000))
              .RuleFor(o => o.Created, f => f.Date.Past(3))
              .RuleFor(o => o.CreatedBy, f => "seeder")
              .RuleFor(o => o.Updated, f => null)
              .RuleFor(o => o.UpdatedBy, f => null);

            return faker.Generate(rowCount);
        }

        public List<Schedule> GetSchedules(int rowCount, IEnumerable<Order> orders, IEnumerable<string> userIds)
        {
            var orderList = orders.ToList();
            var userList = userIds.ToList();

            var faker = new Faker<Schedule>()
                .RuleFor(s => s.Id, f => Guid.NewGuid())
                .RuleFor(s => s.OrderId, f => f.PickRandom(orderList).Id)
                .RuleFor(s => s.Order, (f, s) => orderList.First(o => o.Id == s.OrderId))
                .RuleFor(s => s.ScheduledStart, f => f.Date.Soon(30))
                .RuleFor(s => s.ScheduledEnd, (f, s) => s.ScheduledStart.AddHours(f.Random.Int(1, 8)))
                .RuleFor(s => s.Title, f => f.Lorem.Sentence(3))
                .RuleFor(s => s.Description, f => f.Lorem.Paragraph(1))
                .RuleFor(s => s.AssignedToId, f => f.PickRandom(userList))
                .RuleFor(s => s.Created, f => f.Date.Past(1))
                .RuleFor(s => s.CreatedBy, f => "seeder")
                .RuleFor(s => s.Updated, f => null)
                .RuleFor(s => s.UpdatedBy, f => null);

            return faker.Generate(rowCount);
        }
    }
}