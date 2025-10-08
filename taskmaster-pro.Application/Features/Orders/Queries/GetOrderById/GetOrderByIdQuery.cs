namespace taskmaster_pro.Application.Features.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQuery : IRequest<OrderViewModel>
    {
        public Guid Id { get; set; }
    }
}