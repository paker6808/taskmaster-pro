namespace taskmaster_pro.Application.Features.Orders.Queries.OrderExists
{
    public record OrderExistsQuery(Guid Id) : IRequest<bool>;
}
