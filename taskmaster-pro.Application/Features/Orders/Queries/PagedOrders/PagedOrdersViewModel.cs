namespace taskmaster_pro.Application.Features.Orders.Queries.PagedOrders
{
    public class PagedOrdersViewModel
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public Guid UserId { get; set; }
        public string UserEmail { get; set; }
        public DateTime Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Updated { get; set; }
        public string UpdatedBy { get; set; }
    }
}