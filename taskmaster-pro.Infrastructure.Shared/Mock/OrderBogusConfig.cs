namespace taskmaster_pro.Infrastructure.Shared.Mock
{
    /// <summary>
    /// Bogus configuration for generating fake Order data.
    /// </summary>
    public class OrderBogusConfig : Faker<Order>
    {
        public OrderBogusConfig(IEnumerable<string> userIds, string createdBy = null, DateTime? createdAt = null)
        {
            var userList = userIds?.ToList() ?? new List<string>();

            RuleFor(o => o.Id, f => f.Random.Guid());
            RuleFor(o => o.CustomerName, f => f.Company.CompanyName());
            RuleFor(o => o.OrderDate, f => f.Date.Past(2));
            RuleFor(o => o.Status, f => f.PickRandom<OrderStatus>());
            RuleFor(o => o.TotalAmount, f => f.Finance.Amount(100, 10000));
            RuleFor(o => o.UserId, f => f.PickRandom(userList));
            RuleFor(o => o.Created, f => createdAt ?? f.Date.Recent());
            RuleFor(o => o.CreatedBy, f => createdBy ?? f.PickRandom(userList));
            RuleFor(o => o.Updated, f => null);
            RuleFor(o => o.UpdatedBy, f => null);
        }
    }
}