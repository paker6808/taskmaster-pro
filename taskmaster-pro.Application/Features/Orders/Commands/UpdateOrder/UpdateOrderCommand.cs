namespace taskmaster_pro.Application.Features.Orders.Commands.UpdateOrder
{
    public class UpdateOrderCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
    }
}