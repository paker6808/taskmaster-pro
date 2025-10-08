using Features.Users.ViewModels;
using taskmaster_pro.Application.Common.Models;

namespace taskmaster_pro.Application.Features.Admin.Queries.GetPagedUsers
{
    public class GetPagedUsersQuery : IRequest<PagedDataTableResponse<IEnumerable<UserViewModel>>>
    {
        public int Draw { get; set; }
        public int Start { get; set; }
        public int Length { get; set; }
        public List<DataTableOrder> Order { get; set; } = new();
        public List<DataTableColumn> Columns { get; set; } = new();

        // Optional convenience mapped values
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? OrderBy { get; set; }
        public string? Fields { get; set; }
    }
}
