using taskmaster_pro.Application.Features.Admin.ViewModels;

namespace taskmaster_pro.Application.Features.Admin.Queries.GetAdminUserById
{
    public class GetAdminUserByIdQueryHandler : IRequestHandler<GetAdminUserByIdQuery, AdminUserViewModel>
    {
        private readonly IUserService _userService;

        public GetAdminUserByIdQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<AdminUserViewModel> Handle(GetAdminUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userService.GetAdminUserByIdAsync(request.UserId);

            if (user == null)
                return null;

            return user;
        }
    }
}
