namespace taskmaster_pro.Application.Parameters
{
    // <summary>
    // Represents parameters for paginated queries, including
    // page number, page size, ordering, and fields selection.
    // </summary>
    public class PageQueryParameters
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public string Fields { get; set; }
    }
}