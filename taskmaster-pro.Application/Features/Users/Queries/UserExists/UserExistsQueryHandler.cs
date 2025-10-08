namespace taskmaster_pro.Application.Features.Users.Queries.UserExists
{
    public class UserExistsQueryHandler : IRequestHandler<UserExistsQuery, bool>
    {
        private readonly IUserService _userService;

        public UserExistsQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<bool> Handle(UserExistsQuery request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.UserId, out var id))
                return false;

            return await _userService.UserExistsAsync(id);
        }
    }
}
