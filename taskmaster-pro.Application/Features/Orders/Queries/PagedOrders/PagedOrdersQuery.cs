namespace taskmaster_pro.Application.Features.Orders.Queries.PagedOrders
{
    public class PagedOrdersQuery : QueryParameter,
    IRequest<PagedDataTableResponse<IEnumerable<PagedOrdersViewModel>>>
    {
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public IList<SortOrder> Order { get; set; }
        public IList<Column> Columns { get; set; }
        public bool IsAdmin { get; set; } = false;
        public bool IncludeAllForAdmin { get; set; } = false;
    }
}