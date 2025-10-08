using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Orders.Queries.GetOrderById
{
    public class OrderViewModel
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string UserId { get; set; }
        public DateTime Created { get; set; }
        public UserViewModel? CreatedBy { get; set; }
        public DateTime? Updated { get; set; }
        public UserViewModel? UpdatedBy { get; set; }
    }
}