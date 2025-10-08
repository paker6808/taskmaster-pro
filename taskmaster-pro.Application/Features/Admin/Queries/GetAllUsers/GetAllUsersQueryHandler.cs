using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Admin.Queries.GetAllUsers
{
    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, IEnumerable<UserViewModel>>
    {
        private readonly IUserService _userService;

        public GetAllUsersQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<IEnumerable<UserViewModel>> Handle(
            GetAllUsersQuery request,
            CancellationToken cancellationToken)
        {
            return await _userService.GetAllUsersAsync();
        }
    }
}
