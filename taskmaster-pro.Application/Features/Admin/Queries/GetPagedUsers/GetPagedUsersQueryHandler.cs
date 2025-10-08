using Features.Users.ViewModels;
using taskmaster_pro.Application.Features.Admin.Queries.GetPagedUsers;

namespace Features.Admin.Queries.GetPagedUsers
{
    public class GetPagedUsersQueryHandler : IRequestHandler<GetPagedUsersQuery, PagedDataTableResponse<IEnumerable<UserViewModel>>>
    {
        private readonly IUserService _userService;

        public GetPagedUsersQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<PagedDataTableResponse<IEnumerable<UserViewModel>>> Handle(GetPagedUsersQuery request, CancellationToken cancellationToken)
        {
            // Defensive mapping of DataTable-style paging
            request.PageNumber = (request.Start / request.Length) + 1;
            request.PageSize = request.Length;

            // Fetch users and total count from service
            var (users, totalRecords) = await _userService.GetPagedUsersAsync(request, cancellationToken);

            // Build response for DataTable
            return new PagedDataTableResponse<IEnumerable<UserViewModel>>(
                users,
                request.Draw,
                totalRecords
            );
        }
    }
}
