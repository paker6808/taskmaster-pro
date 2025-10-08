namespace taskmaster_pro.Application.Parameters
{
    /// <summary>
    /// Represents a query parameter for sorting data.
    /// Inherits from PagingParameter to include pagination properties.
    /// </summary>
    public class QueryParameter : PagingParameter
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string Fields { get; set; }
        public string OrderBy { get; set; }
    }
}