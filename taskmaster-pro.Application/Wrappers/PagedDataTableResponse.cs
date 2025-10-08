namespace taskmaster_pro.Application.Wrappers
{
    // A response object that includes data and paged information for a DataTable.
    public class PagedDataTableResponse<T> : Response<T>
    {
        // The number of times the request has been processed.
        public int Draw { get; set; }

        // The total number of records in the table.
        public int RecordsTotal { get; set; }

        // Constructor for PagedDataTableResponse object. Initializes the response with data, page number, and record counts.
        public PagedDataTableResponse(T data, int draw, int recordsTotal)
        {
            this.Draw = draw;
            this.RecordsTotal = recordsTotal;
            this.Data = data;
            this.Message = null;
            this.Succeeded = true;
            this.Errors = null;
        }
    }
}