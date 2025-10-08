namespace taskmaster_pro.Application.Common.Models
{
    public class DataTableRequest
    {
        public int Draw { get; set; }   // DataTables draw counter
        public int Start { get; set; }  // Paging first record index
        public int Length { get; set; } // Page size

        public List<DataTableColumn> Columns { get; set; } = new();
        public List<DataTableOrder> Order { get; set; } = new();

        // Convenience props (mapped inside handler)
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? OrderBy { get; set; }
    }

    public class DataTableOrder
    {
        public int Column { get; set; }       // Column index
        public string Dir { get; set; } = ""; // "asc" / "desc"
    }

    public class DataTableColumn
    {
        public string Data { get; set; } = ""; // The field name coming from DataTables
        public string Name { get; set; } = "";
        public bool Orderable { get; set; }
    }
}
