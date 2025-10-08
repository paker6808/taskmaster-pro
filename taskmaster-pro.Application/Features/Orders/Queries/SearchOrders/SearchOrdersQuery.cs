namespace taskmaster_pro.Application.Features.Orders.Queries.SearchOrders
{
    public record SearchOrdersQuery(string Query) : IRequest<List<Order>>;
}
