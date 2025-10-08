using taskmaster_pro.Application.Features.Users.DTOs;

namespace taskmaster_pro.Application.Features.Users.Queries.SearchUsers
{
    public class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, List<UserDto>>
    {
        private readonly IUserService _userService;

        public SearchUsersQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<List<UserDto>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
                return new List<UserDto>();

            var users = await _userService.SearchUsersAsync(request.Query.Trim());

            return users;
        }
    }
}
