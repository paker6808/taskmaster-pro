using Features.Users.ViewModels;

namespace Features.Users.Queries.GetUserById
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserViewModel>
    {
        private readonly IUserService _userService;

        public GetUserByIdQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<UserViewModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userService.GetUserByIdAsync(request.UserId);
            if (user == null)
                throw new NotFoundException(nameof(UserViewModel), request.UserId);

            return user;
        }
    }
}
