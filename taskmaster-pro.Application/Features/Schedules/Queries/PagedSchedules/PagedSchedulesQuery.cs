namespace taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules
{
    public class PagedSchedulesQuery : QueryParameter, IRequest<PagedDataTableResponse<IEnumerable<IDictionary<string, object>>>>
    {
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public IList<SortOrder> Order { get; set; }
        public IList<Column> Columns { get; set; }
        public bool IncludeAllForAdmin { get; set; } = false;
    }
}
