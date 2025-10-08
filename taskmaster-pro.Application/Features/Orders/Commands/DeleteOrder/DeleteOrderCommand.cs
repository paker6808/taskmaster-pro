namespace taskmaster_pro.Application.Features.Orders.Commands.DeleteOrder
{
    public class DeleteOrderCommand : IRequest<Guid>
    {
        public Guid Id { get; set; }
    }
}
