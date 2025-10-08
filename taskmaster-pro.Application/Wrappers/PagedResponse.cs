namespace taskmaster_pro.Application.Wrappers
{
    // PagedResponse class that inherits from Response<T> class and represents a paged response with data and pagination information.
    public class PagedResponse<T> : Response<T>
    {
        // Gets or sets the current page number of the response.
        public virtual int PageNumber { get; set; }

        // Gets the size of each page in the response.
        public int PageSize { get; set; }

        // Gets the total number of records available.
        public int RecordsTotal { get; set; }

        // Initializes a new instance of the PagedResponse class with the specified data and pagination information.
        public PagedResponse(T data, int pageNumber, int pageSize, int recordsTotal)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.RecordsTotal = recordsTotal;
            this.Data = data;
            this.Message = null;
            this.Succeeded = true;
            this.Errors = null;
        }
    }
}